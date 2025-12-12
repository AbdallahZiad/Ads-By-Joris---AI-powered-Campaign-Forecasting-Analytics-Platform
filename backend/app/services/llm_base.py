import json
import os
import asyncio
import time
from typing import Dict, Type, Any, Optional

from pydantic import BaseModel, ValidationError
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam, ChatCompletionSystemMessageParam, \
    ChatCompletionUserMessageParam
from openai.lib.azure import OpenAIError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings
from app.schemas.llm_schemas import LLMTokenMetrics, PhaseMetrics, Phase


class LLMServiceError(Exception):
    """Custom exception for LLM service failures."""
    pass


class BaseLLMService:
    """
    Base service for interacting with OpenAI.
    Handles Authentication, Retries, JSON Parsing, and Token Counting.
    """

    _MODEL_NAME = "gpt-4o-mini"
    _RETRY_ATTEMPTS = 3
    _PROMPT_DIR = "app/prompts"

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._total_tokens_used: int = 0
        self._phase_metrics: Dict[Phase, PhaseMetrics] = {}

        # Temp counters for current phase
        self._current_phase_tokens: int = 0
        self._current_phase_api_calls: int = 0

    def get_token_metrics(self) -> LLMTokenMetrics:
        """Provides the current accumulated token usage."""
        return LLMTokenMetrics(
            total_tokens=self._total_tokens_used,
            phase_metrics=self._phase_metrics
        )

    def _load_prompt_template(self, filename: str) -> str:
        """Loads a prompt template from file."""
        path = os.path.join(self._PROMPT_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError as e:
            raise LLMServiceError(f"Prompt template file not found: {path}") from e

    async def _track_phase_stats(self, phase: Phase, phase_coro: Any) -> Any:
        """Wraps an async operation to track its metrics."""
        self._current_phase_tokens = 0
        self._current_phase_api_calls = 0
        start_time = time.time()

        result = await phase_coro

        end_time = time.time()
        time_taken = end_time - start_time

        self._phase_metrics[phase] = PhaseMetrics(
            time_taken_seconds=time_taken,
            tokens_used=self._current_phase_tokens,
            api_calls=self._current_phase_api_calls
        )
        return result

    @retry(
        stop=stop_after_attempt(_RETRY_ATTEMPTS),
        wait=wait_exponential(min=2, max=5),
        retry=retry_if_exception_type((OpenAIError, ValidationError, json.JSONDecodeError, asyncio.TimeoutError))
    )
    async def _call_api_with_retry(
            self,
            prompt_filename: str,
            input_data: Dict[str, Any],
            response_model: Type[BaseModel],
            semaphore: asyncio.Semaphore = None
    ) -> Any:
        """
        Executes an OpenAI chat completion using JSON mode.
        """
        if semaphore:
            async with semaphore:
                return await self._execute_api_call(prompt_filename, input_data, response_model)
        else:
            return await self._execute_api_call(prompt_filename, input_data, response_model)

    async def _execute_api_call(
            self,
            prompt_filename: str,
            input_data: Dict[str, Any],
            response_model: Type[BaseModel]
    ) -> Any:
        template = self._load_prompt_template(prompt_filename)
        user_content = template.format(**input_data)

        messages: List[ChatCompletionMessageParam] = [
            ChatCompletionSystemMessageParam(
                role="system",
                content=f"You are an expert AI. Respond ONLY with a JSON object that strictly adheres to the schema for: {response_model.__name__}."
            ),
            ChatCompletionUserMessageParam(
                role="user",
                content=user_content
            )
        ]

        try:
            self._current_phase_api_calls += 1
            response = await self.client.chat.completions.create(
                model=self._MODEL_NAME,
                messages=messages,
                n=1,
                response_format={"type": "json_object"},
                temperature=0.0
            )

            if response.usage and response.usage.total_tokens:
                tokens = response.usage.total_tokens
                self._total_tokens_used += tokens
                self._current_phase_tokens += tokens

            json_string = response.choices[0].message.content
            data_dict = json.loads(json_string)
            validated_response = response_model.model_validate(data_dict)

            return validated_response

        except (OpenAIError, ValidationError, json.JSONDecodeError) as e:
            print(f"LLM API attempt failed: {type(e).__name__}. Retrying...")
            raise