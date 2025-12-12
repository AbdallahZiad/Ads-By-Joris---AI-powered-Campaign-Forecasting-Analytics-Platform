import json
from typing import List, Dict, Optional, Any

from app.services.llm_base import BaseLLMService
from app.schemas.llm_schemas import AutoLinkMatchResult, Phase

class AutoLinkLLMService(BaseLLMService):
    """
    Specialized LLM Service for Auto-Linking.
    Matches Internal Projects -> Google Campaigns -> Ad Groups.
    """

    def _prepare_list_for_prompt(self, items: List[Any], id_field: str = "id", name_field: str = "name") -> str:
        """
        Cleans object lists into a minimal JSON string (ID + Name) to save tokens.
        """
        clean_list = []
        for item in items:
            # Handle both Pydantic models and SQLAlchemy models
            i_id = getattr(item, id_field)
            i_name = getattr(item, name_field)
            # Convert UUIDs to strings if necessary
            clean_list.append({"id": str(i_id), "name": i_name})
        return json.dumps(clean_list, indent=2)

    async def match_items(self, source_items: List[Any], target_items: List[Any]) -> Dict[str, Optional[str]]:
        """
        Generic matching function.
        Source Items: App Categories or Groups
        Target Items: Google Campaigns or Ad Groups
        Returns: Dict { source_id: target_id_or_none }
        """
        if not source_items or not target_items:
            return {}

        # 1. Clean Data (Minimize Tokens)
        source_str = self._prepare_list_for_prompt(source_items)
        target_str = self._prepare_list_for_prompt(target_items)

        # 2. Call LLM
        # We track this under the AUTO_LINKING phase
        result: AutoLinkMatchResult = await self._track_phase_stats(
            Phase.AUTO_LINKING,
            self._call_api_with_retry(
                prompt_filename="auto_link_matcher.txt",
                input_data={
                    "source_items": source_str,
                    "target_items": target_str
                },
                response_model=AutoLinkMatchResult
            )
        )

        return result.matches