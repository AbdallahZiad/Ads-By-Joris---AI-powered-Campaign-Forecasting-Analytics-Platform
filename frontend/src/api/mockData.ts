import {GoogleAdsKeywordResponse, ForecastResponse, ScannerResponse} from '../types';

export const MOCK_HISTORY_DB: GoogleAdsKeywordResponse = {
    "results": [
        {
            "text": "mit tee",
            "keyword_metrics": {
                "competition": "LOW",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 70
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 70
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 90
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 90
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 70
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 90
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 90
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 90
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 90
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 260
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 170
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 70
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 30
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 30
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 40
                    }
                ],
                "avg_monthly_searches": 40,
                "competition_index": 7,
                "low_top_of_page_bid_micros": null,
                "high_top_of_page_bid_micros": null,
                "average_cpc_micros": null
            }
        },
        {
            "text": "mountains tee",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 390
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 390
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 390
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 390
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 590
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 590
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 590
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 590
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 590
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 880
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 590
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 480
                    }
                ],
                "avg_monthly_searches": 590,
                "competition_index": 91,
                "low_top_of_page_bid_micros": 338363,
                "high_top_of_page_bid_micros": 1694153,
                "average_cpc_micros": 645119
            }
        },
        {
            "text": "waves tee",
            "keyword_metrics": {
                "competition": "LOW",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 20
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 10
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 20
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 10
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 10
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 30
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 110
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 90
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 90
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 70
                    }
                ],
                "avg_monthly_searches": 50,
                "competition_index": 32,
                "low_top_of_page_bid_micros": null,
                "high_top_of_page_bid_micros": null,
                "average_cpc_micros": 602288
            }
        },
        {
            "text": "kids clothing",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 60500
                    }
                ],
                "avg_monthly_searches": 110000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 642023,
                "high_top_of_page_bid_micros": 2886248,
                "average_cpc_micros": 1977033
            }
        },
        {
            "text": "jacket",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    }
                ],
                "avg_monthly_searches": 201000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 381743,
                "high_top_of_page_bid_micros": 1900043,
                "average_cpc_micros": 669218
            }
        },
        {
            "text": "shorts",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 6120000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 6120000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 13600000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 13600000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 16600000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 16600000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 13600000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 13600000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 16600000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 6120000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 6120000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 1220000
                    }
                ],
                "avg_monthly_searches": 1500000,
                "competition_index": 60,
                "low_top_of_page_bid_micros": 234251,
                "high_top_of_page_bid_micros": 546587,
                "average_cpc_micros": 714314
            }
        },
        {
            "text": "sleeves",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    }
                ],
                "avg_monthly_searches": 40500,
                "competition_index": 47,
                "low_top_of_page_bid_micros": 265358,
                "high_top_of_page_bid_micros": 2238407,
                "average_cpc_micros": 785286
            }
        },
        {
            "text": "beanies",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 201000
                    }
                ],
                "avg_monthly_searches": 201000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 269519,
                "high_top_of_page_bid_micros": 1761227,
                "average_cpc_micros": 707485
            }
        },
        {
            "text": "ladies clothing",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 3600
                    }
                ],
                "avg_monthly_searches": 5400,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 152406,
                "high_top_of_page_bid_micros": 1960775,
                "average_cpc_micros": 937064
            }
        },
        {
            "text": "galaxy pants",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 880
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 880
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 720
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 720
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 880
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 880
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 880
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 880
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 880
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 1000
                    }
                ],
                "avg_monthly_searches": 1000,
                "competition_index": 49,
                "low_top_of_page_bid_micros": 294983,
                "high_top_of_page_bid_micros": 954359,
                "average_cpc_micros": 453169
            }
        },
        {
            "text": "apple computers",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 90500
                    }
                ],
                "avg_monthly_searches": 90500,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 216899,
                "high_top_of_page_bid_micros": 2299139,
                "average_cpc_micros": 887036
            }
        },
        {
            "text": "ipads",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 5000000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 2740000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 3350000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 4090000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 1830000
                    }
                ],
                "avg_monthly_searches": 1830000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 190871,
                "high_top_of_page_bid_micros": 1006415,
                "average_cpc_micros": 1061561
            }
        },
        {
            "text": "lenovo computers",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 14800
                    }
                ],
                "avg_monthly_searches": 14800,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 277631,
                "high_top_of_page_bid_micros": 2368547,
                "average_cpc_micros": 1602054
            }
        },
        {
            "text": "adapters",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    }
                ],
                "avg_monthly_searches": 40500,
                "competition_index": 76,
                "low_top_of_page_bid_micros": 105081,
                "high_top_of_page_bid_micros": 589967,
                "average_cpc_micros": 418520
            }
        },
        {
            "text": "cables",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 74000
                    }
                ],
                "avg_monthly_searches": 90500,
                "competition_index": 47,
                "low_top_of_page_bid_micros": 1266695,
                "high_top_of_page_bid_micros": 11061899,
                "average_cpc_micros": 8838029
            }
        },
        {
            "text": "usb storage",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 4400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 3600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 2900
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 2900
                    }
                ],
                "avg_monthly_searches": 2900,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 216899,
                "high_top_of_page_bid_micros": 884951,
                "average_cpc_micros": 506124
            }
        },
        {
            "text": "technology",
            "keyword_metrics": {
                "competition": "LOW",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 823000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 823000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 823000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 1000000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 2240000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    }
                ],
                "avg_monthly_searches": 246000,
                "competition_index": 3,
                "low_top_of_page_bid_micros": 251603,
                "high_top_of_page_bid_micros": 3340338,
                "average_cpc_micros": 2583151
            }
        },
        {
            "text": "backpacks",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 1830000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    }
                ],
                "avg_monthly_searches": 550000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 260279,
                "high_top_of_page_bid_micros": 1457567,
                "average_cpc_micros": 900146
            }
        },
        {
            "text": "folders",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 90500
                    }
                ],
                "avg_monthly_searches": 74000,
                "competition_index": 86,
                "low_top_of_page_bid_micros": 884951,
                "high_top_of_page_bid_micros": 11946851,
                "average_cpc_micros": 1851234
            }
        },
        {
            "text": "notebooks",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    }
                ],
                "avg_monthly_searches": 301000,
                "competition_index": 79,
                "low_top_of_page_bid_micros": 225575,
                "high_top_of_page_bid_micros": 1171259,
                "average_cpc_micros": 1295768
            }
        },
        {
            "text": "pencils",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 246000
                    }
                ],
                "avg_monthly_searches": 165000,
                "competition_index": 58,
                "low_top_of_page_bid_micros": 95435,
                "high_top_of_page_bid_micros": 711431,
                "average_cpc_micros": 384656
            }
        },
        {
            "text": "school supplies",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 60500
                    }
                ],
                "avg_monthly_searches": 90500,
                "competition_index": 67,
                "low_top_of_page_bid_micros": 173519,
                "high_top_of_page_bid_micros": 1839311,
                "average_cpc_micros": 1016852
            }
        },
        {
            "text": "stickers",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    }
                ],
                "avg_monthly_searches": 246000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 1249343,
                "high_top_of_page_bid_micros": 8693351,
                "average_cpc_micros": 6828818
            }
        },
        {
            "text": "lab books",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 390
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 390
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 590
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 390
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 880
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 590
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 390
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 390
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 880
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 590
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 880
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 480
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 590
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 1000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 590
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 720
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 590
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 480
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 590
                    }
                ],
                "avg_monthly_searches": 720,
                "competition_index": 52,
                "low_top_of_page_bid_micros": 404272,
                "high_top_of_page_bid_micros": 5925707,
                "average_cpc_micros": 1692967
            }
        },
        {
            "text": "alumni page",
            "keyword_metrics": {
                "competition": "LOW",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 40
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 50
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 50
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 70
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 70
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 90
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 90
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 110
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 70
                    }
                ],
                "avg_monthly_searches": 70,
                "competition_index": 26,
                "low_top_of_page_bid_micros": 1613735,
                "high_top_of_page_bid_micros": 4874843,
                "average_cpc_micros": 4365054
            }
        },
        {
            "text": "cuff link",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 1300
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 2400
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 1600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 1900
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 2400
                    }
                ],
                "avg_monthly_searches": 1900,
                "competition_index": 89,
                "low_top_of_page_bid_micros": 364391,
                "high_top_of_page_bid_micros": 1787255,
                "average_cpc_micros": 657183
            }
        },
        {
            "text": "keyrings",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 8100
                    }
                ],
                "avg_monthly_searches": 8100,
                "competition_index": 91,
                "low_top_of_page_bid_micros": 170627,
                "high_top_of_page_bid_micros": 1179935,
                "average_cpc_micros": 682364
            }
        },
        {
            "text": "magnets",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 60500
                    }
                ],
                "avg_monthly_searches": 49500,
                "competition_index": 98,
                "low_top_of_page_bid_micros": 451151,
                "high_top_of_page_bid_micros": 6203339,
                "average_cpc_micros": 2134171
            }
        },
        {
            "text": "license plate frames",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 60500
                    }
                ],
                "avg_monthly_searches": 74000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 199547,
                "high_top_of_page_bid_micros": 798191,
                "average_cpc_micros": 670844
            }
        },
        {
            "text": "drinkware",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 8100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 5400
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 6600
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 18100
                    }
                ],
                "avg_monthly_searches": 9900,
                "competition_index": 99,
                "low_top_of_page_bid_micros": 242927,
                "high_top_of_page_bid_micros": 893627,
                "average_cpc_micros": 1178753
            }
        },
        {
            "text": "golf towel",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 9900
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 12100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 14800
                    }
                ],
                "avg_monthly_searches": 22200,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 376766,
                "high_top_of_page_bid_micros": 1874015,
                "average_cpc_micros": 1652039
            }
        },
        {
            "text": "caps",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    }
                ],
                "avg_monthly_searches": 368000,
                "competition_index": 45,
                "low_top_of_page_bid_micros": 260279,
                "high_top_of_page_bid_micros": 1587707,
                "average_cpc_micros": 909853
            }
        },
        {
            "text": "gift cards",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 823000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 1220000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 1000000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 246000
                    }
                ],
                "avg_monthly_searches": 301000,
                "competition_index": 100,
                "low_top_of_page_bid_micros": 606771,
                "high_top_of_page_bid_micros": 3607257,
                "average_cpc_micros": 2924640
            }
        },
        {
            "text": "gifts",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 673000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 550000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 823000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 550000
                    }
                ],
                "avg_monthly_searches": 301000,
                "competition_index": 43,
                "low_top_of_page_bid_micros": 364391,
                "high_top_of_page_bid_micros": 1751903,
                "average_cpc_micros": 1335012
            }
        },
        {
            "text": "decals",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    }
                ],
                "avg_monthly_searches": 40500,
                "competition_index": 83,
                "low_top_of_page_bid_micros": 485855,
                "high_top_of_page_bid_micros": 5782897,
                "average_cpc_micros": 4793860
            }
        },
        {
            "text": "flags",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 450000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 301000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 368000
                    }
                ],
                "avg_monthly_searches": 301000,
                "competition_index": 55,
                "low_top_of_page_bid_micros": 294983,
                "high_top_of_page_bid_micros": 3192767,
                "average_cpc_micros": 689163
            }
        },
        {
            "text": "athletics page",
            "keyword_metrics": {
                "competition": "LOW",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 20
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 50
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 40
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 30
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 30
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 50
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 70
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 40
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 70
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 50
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 20
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 50
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 70
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 140
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 170
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 210
                    }
                ],
                "avg_monthly_searches": 90,
                "competition_index": 1,
                "low_top_of_page_bid_micros": null,
                "high_top_of_page_bid_micros": null,
                "average_cpc_micros": null
            }
        },
        {
            "text": "pet supplies",
            "keyword_metrics": {
                "competition": "MEDIUM",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 1500000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 110000
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 246000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 165000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 135000
                    }
                ],
                "avg_monthly_searches": 165000,
                "competition_index": 46,
                "low_top_of_page_bid_micros": 347039,
                "high_top_of_page_bid_micros": 2967331,
                "average_cpc_micros": 1377846
            }
        },
        {
            "text": "plush toys",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 135000
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 18100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 27100
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 14800
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 90500
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 49500
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 40500
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 33100
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 74000
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 22200
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 60500
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 201000
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 40500
                    }
                ],
                "avg_monthly_searches": 90500,
                "competition_index": 88,
                "low_top_of_page_bid_micros": 199547,
                "high_top_of_page_bid_micros": 1011677,
                "average_cpc_micros": 803032
            }
        },
        {
            "text": "2025 caltech dad tee",
            "keyword_metrics": null
        },
        {
            "text": "at the beach tee",
            "keyword_metrics": null
        },
        {
            "text": "basketball spectrum tee",
            "keyword_metrics": null
        },
        {
            "text": "being smart tee",
            "keyword_metrics": null
        },
        {
            "text": "cheat sheet tee",
            "keyword_metrics": null
        },
        {
            "text": "expecto palms tee",
            "keyword_metrics": null
        },
        {
            "text": "hk shine the light tee",
            "keyword_metrics": null
        },
        {
            "text": "ligo tee",
            "keyword_metrics": null
        },
        {
            "text": "spectrum baseball tee",
            "keyword_metrics": null
        },
        {
            "text": "spectrum cross country tee",
            "keyword_metrics": null
        },
        {
            "text": "tennis spectrum tee",
            "keyword_metrics": null
        },
        {
            "text": "volleyball spectrum tee",
            "keyword_metrics": null
        },
        {
            "text": "waterpolo spectrum tee",
            "keyword_metrics": null
        },
        {
            "text": "youth being smart tee",
            "keyword_metrics": null
        },
        {
            "text": "zhang tee",
            "keyword_metrics": {
                "competition": "UNSPECIFIED",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 0
                    }
                ],
                "avg_monthly_searches": 10,
                "competition_index": null,
                "low_top_of_page_bid_micros": null,
                "high_top_of_page_bid_micros": null,
                "average_cpc_micros": null
            }
        },
        {
            "text": "beaver rocket onesie",
            "keyword_metrics": null
        },
        {
            "text": "mark cuff links",
            "keyword_metrics": null
        },
        {
            "text": "mark lapel pin",
            "keyword_metrics": null
        },
        {
            "text": "mark money clip",
            "keyword_metrics": null
        },
        {
            "text": "triblend mark tee",
            "keyword_metrics": null
        },
        {
            "text": "alumni chrome engraved license plate",
            "keyword_metrics": null
        },
        {
            "text": "alumni patch",
            "keyword_metrics": {
                "competition": "HIGH",
                "monthly_search_volumes": [
                    {
                        "month": "NOVEMBER",
                        "year": 2021,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2021,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2022,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2023,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JANUARY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MARCH",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "APRIL",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "MAY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JUNE",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "JULY",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "AUGUST",
                        "year": 2024,
                        "monthly_searches": 0
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2024,
                        "monthly_searches": 40
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2024,
                        "monthly_searches": 30
                    },
                    {
                        "month": "NOVEMBER",
                        "year": 2024,
                        "monthly_searches": 10
                    },
                    {
                        "month": "DECEMBER",
                        "year": 2024,
                        "monthly_searches": 10
                    },
                    {
                        "month": "JANUARY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "FEBRUARY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "MARCH",
                        "year": 2025,
                        "monthly_searches": 40
                    },
                    {
                        "month": "APRIL",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "MAY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "JUNE",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "JULY",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "AUGUST",
                        "year": 2025,
                        "monthly_searches": 10
                    },
                    {
                        "month": "SEPTEMBER",
                        "year": 2025,
                        "monthly_searches": 20
                    },
                    {
                        "month": "OCTOBER",
                        "year": 2025,
                        "monthly_searches": 30
                    }
                ],
                "avg_monthly_searches": 20,
                "competition_index": 79,
                "low_top_of_page_bid_micros": 182195,
                "high_top_of_page_bid_micros": 1674467,
                "average_cpc_micros": 508126
            }
        },
        {
            "text": "alumni wood magnet",
            "keyword_metrics": null
        },
        {
            "text": "caltech alumni decal",
            "keyword_metrics": null
        },
        {
            "text": "minolo alumni mug",
            "keyword_metrics": null
        },
        {
            "text": "legends of caltech i",
            "keyword_metrics": null
        },
        {
            "text": "legends of caltech iii",
            "keyword_metrics": null
        },
        {
            "text": "soccer spectrum tee",
            "keyword_metrics": null
        },
        {
            "text": "swimming spectrum tee",
            "keyword_metrics": null
        }
    ]
}

export const MOCK_FORECAST_DB: ForecastResponse = {
    "forecasts": [
        {
            "keyword": "mountains tee",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 624,
            "annual_growth_rate": 0.1258623346768082,
            "expected_increase_1m": 0.28562871804754014,
            "expected_increase_3m": 0.2068385285937692,
            "expected_increase_6m": 0.17516308338589864,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 624,
                    "lower_bound": 563,
                    "upper_bound": 691
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 802,
                    "lower_bound": 731,
                    "upper_bound": 866
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 705,
                    "lower_bound": 634,
                    "upper_bound": 772
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 751,
                    "lower_bound": 691,
                    "upper_bound": 818
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 726,
                    "lower_bound": 659,
                    "upper_bound": 794
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 704,
                    "lower_bound": 636,
                    "upper_bound": 778
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 710,
                    "lower_bound": 646,
                    "upper_bound": 780
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 733,
                    "lower_bound": 667,
                    "upper_bound": 796
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 857,
                    "lower_bound": 789,
                    "upper_bound": 926
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 739,
                    "lower_bound": 672,
                    "upper_bound": 804
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 671,
                    "lower_bound": 603,
                    "upper_bound": 736
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 631,
                    "lower_bound": 565,
                    "upper_bound": 702
                }
            ]
        },
        {
            "keyword": "kids clothing",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 159105,
            "annual_growth_rate": 0.16307094270195863,
            "expected_increase_1m": -0.09426321250437977,
            "expected_increase_3m": -0.3164099404146,
            "expected_increase_6m": -0.35857898022798507,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 159105,
                    "lower_bound": 117623,
                    "upper_bound": 199261
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 144107,
                    "lower_bound": 102597,
                    "upper_bound": 182161
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 87622,
                    "lower_bound": 47216,
                    "upper_bound": 126778
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 94557,
                    "lower_bound": 56569,
                    "upper_bound": 134212
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 119382,
                    "lower_bound": 79315,
                    "upper_bound": 158003
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 81521,
                    "lower_bound": 41975,
                    "upper_bound": 120264
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 85127,
                    "lower_bound": 44950,
                    "upper_bound": 125932
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 92249,
                    "lower_bound": 52378,
                    "upper_bound": 133437
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 138910,
                    "lower_bound": 97529,
                    "upper_bound": 179806
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 184042,
                    "lower_bound": 146950,
                    "upper_bound": 224989
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 142006,
                    "lower_bound": 102295,
                    "upper_bound": 182654
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 129275,
                    "lower_bound": 89392,
                    "upper_bound": 168003
                }
            ]
        },
        {
            "keyword": "jacket",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 336742,
            "annual_growth_rate": 0.06843161139935433,
            "expected_increase_1m": -0.07227811081557226,
            "expected_increase_3m": -0.3132922407898763,
            "expected_increase_6m": -0.44652304772460905,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 336742,
                    "lower_bound": 317038,
                    "upper_bound": 354716
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 312402,
                    "lower_bound": 294691,
                    "upper_bound": 330504
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 213316,
                    "lower_bound": 193436,
                    "upper_bound": 230223
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 168010,
                    "lower_bound": 149228,
                    "upper_bound": 185837
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 164984,
                    "lower_bound": 146667,
                    "upper_bound": 183749
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 133748,
                    "lower_bound": 114010,
                    "upper_bound": 150294
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 125810,
                    "lower_bound": 105827,
                    "upper_bound": 144058
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 101983,
                    "lower_bound": 83647,
                    "upper_bound": 121570
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 127172,
                    "lower_bound": 107904,
                    "upper_bound": 145604
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 146401,
                    "lower_bound": 127129,
                    "upper_bound": 164933
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 182915,
                    "lower_bound": 162706,
                    "upper_bound": 201462
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 277762,
                    "lower_bound": 259260,
                    "upper_bound": 296525
                }
            ]
        },
        {
            "keyword": "shorts",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 1104285,
            "annual_growth_rate": 0.06888706830904963,
            "expected_increase_1m": 0.015907588901814814,
            "expected_increase_3m": 0.5046386869915271,
            "expected_increase_6m": 0.7049401862929566,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 1104285,
                    "lower_bound": 0,
                    "upper_bound": 6368789
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 1121851,
                    "lower_bound": 0,
                    "upper_bound": 6413336
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 1873795,
                    "lower_bound": 0,
                    "upper_bound": 7668154
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 1989002,
                    "lower_bound": 0,
                    "upper_bound": 7345168
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 2395521,
                    "lower_bound": 0,
                    "upper_bound": 7681249
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 2192065,
                    "lower_bound": 0,
                    "upper_bound": 7997303
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 1724202,
                    "lower_bound": 0,
                    "upper_bound": 6783541
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 1861136,
                    "lower_bound": 0,
                    "upper_bound": 7330899
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 2574464,
                    "lower_bound": 0,
                    "upper_bound": 8149176
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1426193,
                    "lower_bound": 0,
                    "upper_bound": 6348143
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 1029213,
                    "lower_bound": 0,
                    "upper_bound": 6304898
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 985056,
                    "lower_bound": 0,
                    "upper_bound": 6103925
                }
            ]
        },
        {
            "keyword": "sleeves",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 39152,
            "annual_growth_rate": 0.04268719101213148,
            "expected_increase_1m": 0.005162291162373264,
            "expected_increase_3m": -0.04074617119435827,
            "expected_increase_6m": 0.02237149158123087,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 39152,
                    "lower_bound": 36835,
                    "upper_bound": 41555
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 39354,
                    "lower_bound": 36965,
                    "upper_bound": 41812
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 38903,
                    "lower_bound": 36361,
                    "upper_bound": 41233
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 34412,
                    "lower_bound": 31997,
                    "upper_bound": 36720
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 42940,
                    "lower_bound": 40534,
                    "upper_bound": 45224
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 40118,
                    "lower_bound": 37778,
                    "upper_bound": 42632
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 44437,
                    "lower_bound": 42071,
                    "upper_bound": 46769
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 40748,
                    "lower_bound": 38443,
                    "upper_bound": 43062
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 44214,
                    "lower_bound": 41778,
                    "upper_bound": 46586
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 44459,
                    "lower_bound": 42164,
                    "upper_bound": 46904
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 41315,
                    "lower_bound": 38986,
                    "upper_bound": 43767
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 41257,
                    "lower_bound": 38749,
                    "upper_bound": 43565
                }
            ]
        },
        {
            "keyword": "beanies",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 369726,
            "annual_growth_rate": -0.023066528282584247,
            "expected_increase_1m": 0.2001638103861553,
            "expected_increase_3m": -0.14676635411880457,
            "expected_increase_6m": -0.3950928301582974,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 369726,
                    "lower_bound": 342854,
                    "upper_bound": 395581
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 443731,
                    "lower_bound": 417960,
                    "upper_bound": 470130
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 309576,
                    "lower_bound": 285236,
                    "upper_bound": 337659
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 193080,
                    "lower_bound": 168164,
                    "upper_bound": 219096
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 162754,
                    "lower_bound": 137057,
                    "upper_bound": 190153
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 128597,
                    "lower_bound": 103676,
                    "upper_bound": 155704
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 104158,
                    "lower_bound": 77864,
                    "upper_bound": 130764
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 96319,
                    "lower_bound": 67793,
                    "upper_bound": 121775
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 94417,
                    "lower_bound": 68332,
                    "upper_bound": 119414
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 101613,
                    "lower_bound": 76024,
                    "upper_bound": 127961
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 148833,
                    "lower_bound": 121648,
                    "upper_bound": 176166
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 241654,
                    "lower_bound": 214866,
                    "upper_bound": 269108
                }
            ]
        },
        {
            "keyword": "ladies clothing",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 6293,
            "annual_growth_rate": -0.29459011663136403,
            "expected_increase_1m": -0.11180670826924197,
            "expected_increase_3m": -0.33611525782861323,
            "expected_increase_6m": -0.3976648080947948,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 6293,
                    "lower_bound": 2845,
                    "upper_bound": 9697
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 5589,
                    "lower_bound": 2260,
                    "upper_bound": 9044
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 3906,
                    "lower_bound": 758,
                    "upper_bound": 7121
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 3037,
                    "lower_bound": 0,
                    "upper_bound": 6278
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 3422,
                    "lower_bound": 250,
                    "upper_bound": 6784
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 3656,
                    "lower_bound": 622,
                    "upper_bound": 6939
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 3129,
                    "lower_bound": 25,
                    "upper_bound": 6397
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 2850,
                    "lower_bound": 0,
                    "upper_bound": 6208
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 2923,
                    "lower_bound": 0,
                    "upper_bound": 6064
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 3063,
                    "lower_bound": 125,
                    "upper_bound": 6437
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 2957,
                    "lower_bound": 0,
                    "upper_bound": 5953
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 3679,
                    "lower_bound": 165,
                    "upper_bound": 6921
                }
            ]
        },
        {
            "keyword": "galaxy pants",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 961,
            "annual_growth_rate": 0.03800570046028677,
            "expected_increase_1m": 0.04491978920194019,
            "expected_increase_3m": 0.00549208159853617,
            "expected_increase_6m": 0.03754799657097876,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 961,
                    "lower_bound": 845,
                    "upper_bound": 1079
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 1004,
                    "lower_bound": 886,
                    "upper_bound": 1121
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 1025,
                    "lower_bound": 903,
                    "upper_bound": 1140
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 869,
                    "lower_bound": 747,
                    "upper_bound": 983
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 1014,
                    "lower_bound": 894,
                    "upper_bound": 1126
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 1020,
                    "lower_bound": 902,
                    "upper_bound": 1141
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 1048,
                    "lower_bound": 927,
                    "upper_bound": 1156
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 887,
                    "lower_bound": 774,
                    "upper_bound": 1004
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 957,
                    "lower_bound": 843,
                    "upper_bound": 1076
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1474,
                    "lower_bound": 1362,
                    "upper_bound": 1590
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 998,
                    "lower_bound": 887,
                    "upper_bound": 1112
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 1007,
                    "lower_bound": 889,
                    "upper_bound": 1119
                }
            ]
        },
        {
            "keyword": "apple computers",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 117924,
            "annual_growth_rate": 0.01807881092008988,
            "expected_increase_1m": -0.11720877504565595,
            "expected_increase_3m": -0.18895112898439992,
            "expected_increase_6m": -0.23737576946167593,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 117924,
                    "lower_bound": 111650,
                    "upper_bound": 124453
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 104102,
                    "lower_bound": 97647,
                    "upper_bound": 110442
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 99144,
                    "lower_bound": 92369,
                    "upper_bound": 105763
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 83679,
                    "lower_bound": 77344,
                    "upper_bound": 89900
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 91550,
                    "lower_bound": 85302,
                    "upper_bound": 97838
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 80052,
                    "lower_bound": 73810,
                    "upper_bound": 86125
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 81061,
                    "lower_bound": 74323,
                    "upper_bound": 87814
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 79449,
                    "lower_bound": 72503,
                    "upper_bound": 85865
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 91566,
                    "lower_bound": 85032,
                    "upper_bound": 97987
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 93016,
                    "lower_bound": 86742,
                    "upper_bound": 99905
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 94451,
                    "lower_bound": 88361,
                    "upper_bound": 100939
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 95743,
                    "lower_bound": 89392,
                    "upper_bound": 102866
                }
            ]
        },
        {
            "keyword": "ipads",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 2990608,
            "annual_growth_rate": -0.06709635317882787,
            "expected_increase_1m": 0.08084077665757118,
            "expected_increase_3m": -0.24190661034373373,
            "expected_increase_6m": -0.36124343232180034,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 2990608,
                    "lower_bound": 2472963,
                    "upper_bound": 3511223
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 3232371,
                    "lower_bound": 2688752,
                    "upper_bound": 3763612
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 1883012,
                    "lower_bound": 1357371,
                    "upper_bound": 2426769
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 1686096,
                    "lower_bound": 1140472,
                    "upper_bound": 2245634
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 1731899,
                    "lower_bound": 1202050,
                    "upper_bound": 2240114
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 1443286,
                    "lower_bound": 886361,
                    "upper_bound": 1966563
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 1484956,
                    "lower_bound": 921539,
                    "upper_bound": 2019229
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 1374762,
                    "lower_bound": 799648,
                    "upper_bound": 1940187
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 1485761,
                    "lower_bound": 967635,
                    "upper_bound": 2051019
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1562968,
                    "lower_bound": 1035792,
                    "upper_bound": 2079506
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 1487866,
                    "lower_bound": 932717,
                    "upper_bound": 2047290
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 1802199,
                    "lower_bound": 1281972,
                    "upper_bound": 2331683
                }
            ]
        },
        {
            "keyword": "lenovo computers",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 20216,
            "annual_growth_rate": 0.17229143650291195,
            "expected_increase_1m": -0.07415909776999753,
            "expected_increase_3m": -0.11766181195382328,
            "expected_increase_6m": -0.1435249658465769,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 20216,
                    "lower_bound": 19052,
                    "upper_bound": 21379
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 18716,
                    "lower_bound": 17534,
                    "upper_bound": 19819
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 18778,
                    "lower_bound": 17632,
                    "upper_bound": 19900
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 16016,
                    "lower_bound": 14929,
                    "upper_bound": 17116
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 17250,
                    "lower_bound": 16186,
                    "upper_bound": 18453
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 16358,
                    "lower_bound": 15230,
                    "upper_bound": 17462
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 16766,
                    "lower_bound": 15612,
                    "upper_bound": 17815
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 17024,
                    "lower_bound": 15879,
                    "upper_bound": 18081
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 19339,
                    "lower_bound": 18138,
                    "upper_bound": 20455
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 20570,
                    "lower_bound": 19366,
                    "upper_bound": 21706
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 19220,
                    "lower_bound": 17931,
                    "upper_bound": 20346
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 16381,
                    "lower_bound": 15243,
                    "upper_bound": 17536
                }
            ]
        },
        {
            "keyword": "adapters",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 41978,
            "annual_growth_rate": 0.06876324113628646,
            "expected_increase_1m": 0.10427666478563387,
            "expected_increase_3m": 0.03887070921565636,
            "expected_increase_6m": 0.04960248064667191,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 41978,
                    "lower_bound": 38851,
                    "upper_bound": 44826
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 46355,
                    "lower_bound": 43169,
                    "upper_bound": 49618
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 43964,
                    "lower_bound": 40783,
                    "upper_bound": 47187
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 40509,
                    "lower_bound": 37560,
                    "upper_bound": 43786
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 44024,
                    "lower_bound": 40730,
                    "upper_bound": 47150
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 44679,
                    "lower_bound": 41444,
                    "upper_bound": 47691
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 44827,
                    "lower_bound": 41779,
                    "upper_bound": 47978
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 43034,
                    "lower_bound": 39829,
                    "upper_bound": 45986
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 45870,
                    "lower_bound": 42811,
                    "upper_bound": 48698
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 46367,
                    "lower_bound": 43258,
                    "upper_bound": 49653
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 44594,
                    "lower_bound": 41491,
                    "upper_bound": 47727
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 44541,
                    "lower_bound": 41359,
                    "upper_bound": 47817
                }
            ]
        },
        {
            "keyword": "cables",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 86757,
            "annual_growth_rate": -0.03086093798678604,
            "expected_increase_1m": -0.0042451018177576995,
            "expected_increase_3m": -0.0447944965648885,
            "expected_increase_6m": -0.0046144645049679585,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 86757,
                    "lower_bound": 73374,
                    "upper_bound": 99485
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 86388,
                    "lower_bound": 72753,
                    "upper_bound": 100251
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 81736,
                    "lower_bound": 68134,
                    "upper_bound": 94411
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 80486,
                    "lower_bound": 66455,
                    "upper_bound": 94257
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 93669,
                    "lower_bound": 79642,
                    "upper_bound": 107386
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 83664,
                    "lower_bound": 69755,
                    "upper_bound": 97199
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 92193,
                    "lower_bound": 78308,
                    "upper_bound": 105589
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 74047,
                    "lower_bound": 60129,
                    "upper_bound": 87444
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 81444,
                    "lower_bound": 67386,
                    "upper_bound": 95282
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 78096,
                    "lower_bound": 64318,
                    "upper_bound": 91728
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 77406,
                    "lower_bound": 63853,
                    "upper_bound": 91176
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 78444,
                    "lower_bound": 64837,
                    "upper_bound": 91560
                }
            ]
        },
        {
            "keyword": "usb storage",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 3653,
            "annual_growth_rate": 0.04904954022300787,
            "expected_increase_1m": 0.06386568257623347,
            "expected_increase_3m": -0.05362269945326403,
            "expected_increase_6m": -0.11668800315051685,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 3653,
                    "lower_bound": 3155,
                    "upper_bound": 4140
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 3886,
                    "lower_bound": 3372,
                    "upper_bound": 4358
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 3652,
                    "lower_bound": 3169,
                    "upper_bound": 4155
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 2832,
                    "lower_bound": 2370,
                    "upper_bound": 3302
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 3137,
                    "lower_bound": 2645,
                    "upper_bound": 3640
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 2757,
                    "lower_bound": 2273,
                    "upper_bound": 3243
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 3093,
                    "lower_bound": 2643,
                    "upper_bound": 3592
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 2923,
                    "lower_bound": 2410,
                    "upper_bound": 3411
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 3340,
                    "lower_bound": 2856,
                    "upper_bound": 3841
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 3106,
                    "lower_bound": 2634,
                    "upper_bound": 3589
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 2964,
                    "lower_bound": 2451,
                    "upper_bound": 3459
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 3046,
                    "lower_bound": 2557,
                    "upper_bound": 3547
                }
            ]
        },
        {
            "keyword": "technology",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 325351,
            "annual_growth_rate": 0.44390562881012124,
            "expected_increase_1m": 0.014117808475737056,
            "expected_increase_3m": 0.039754864628626006,
            "expected_increase_6m": 0.08725725531490924,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 325351,
                    "lower_bound": 0,
                    "upper_bound": 797096
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 329944,
                    "lower_bound": 0,
                    "upper_bound": 828996
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 369643,
                    "lower_bound": 0,
                    "upper_bound": 797139
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 315268,
                    "lower_bound": 0,
                    "upper_bound": 763725
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 337837,
                    "lower_bound": 0,
                    "upper_bound": 771503
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 336606,
                    "lower_bound": 0,
                    "upper_bound": 803504
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 433141,
                    "lower_bound": 0,
                    "upper_bound": 895467
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 551475,
                    "lower_bound": 81541,
                    "upper_bound": 997600
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 549480,
                    "lower_bound": 64259,
                    "upper_bound": 986116
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 467851,
                    "lower_bound": 4385,
                    "upper_bound": 934229
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 288789,
                    "lower_bound": 0,
                    "upper_bound": 759676
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 273234,
                    "lower_bound": 0,
                    "upper_bound": 729017
                }
            ]
        },
        {
            "keyword": "backpacks",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 421420,
            "annual_growth_rate": -0.15507747164468902,
            "expected_increase_1m": -0.1114350588153035,
            "expected_increase_3m": -0.16071062999078528,
            "expected_increase_6m": -0.16872875241712276,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 421420,
                    "lower_bound": 355058,
                    "upper_bound": 490389
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 374459,
                    "lower_bound": 300939,
                    "upper_bound": 443948
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 364693,
                    "lower_bound": 294578,
                    "upper_bound": 435568
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 321927,
                    "lower_bound": 253979,
                    "upper_bound": 388676
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 358141,
                    "lower_bound": 285777,
                    "upper_bound": 428460
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 333788,
                    "lower_bound": 263014,
                    "upper_bound": 407877
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 348875,
                    "lower_bound": 277074,
                    "upper_bound": 418565
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 384055,
                    "lower_bound": 313809,
                    "upper_bound": 457501
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 1029131,
                    "lower_bound": 944642,
                    "upper_bound": 1116884
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1110919,
                    "lower_bound": 1018207,
                    "upper_bound": 1209333
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 378653,
                    "lower_bound": 300632,
                    "upper_bound": 452458
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 314336,
                    "lower_bound": 240564,
                    "upper_bound": 386060
                }
            ]
        },
        {
            "keyword": "folders",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 77470,
            "annual_growth_rate": 0.23324481450934387,
            "expected_increase_1m": -0.1264263540921811,
            "expected_increase_3m": 0.03878209045964542,
            "expected_increase_6m": 0.056936241875508525,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 77470,
                    "lower_bound": 72014,
                    "upper_bound": 83109
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 67675,
                    "lower_bound": 62474,
                    "upper_bound": 72725
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 93874,
                    "lower_bound": 88295,
                    "upper_bound": 99367
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 79873,
                    "lower_bound": 74727,
                    "upper_bound": 85122
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 85054,
                    "lower_bound": 80027,
                    "upper_bound": 89853
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 81426,
                    "lower_bound": 75986,
                    "upper_bound": 86850
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 83380,
                    "lower_bound": 78123,
                    "upper_bound": 88581
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 79619,
                    "lower_bound": 74590,
                    "upper_bound": 85165
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 99044,
                    "lower_bound": 93270,
                    "upper_bound": 104828
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 193623,
                    "lower_bound": 187092,
                    "upper_bound": 200250
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 129144,
                    "lower_bound": 123105,
                    "upper_bound": 135266
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 105095,
                    "lower_bound": 98576,
                    "upper_bound": 111160
                }
            ]
        },
        {
            "keyword": "notebooks",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 374552,
            "annual_growth_rate": 0.46255532875841976,
            "expected_increase_1m": -0.027870285826995436,
            "expected_increase_3m": 0.047739177124671364,
            "expected_increase_6m": 0.40793935660806707,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 374552,
                    "lower_bound": 252208,
                    "upper_bound": 496463
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 364113,
                    "lower_bound": 246669,
                    "upper_bound": 477030
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 463266,
                    "lower_bound": 340004,
                    "upper_bound": 582551
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 349919,
                    "lower_bound": 232661,
                    "upper_bound": 460585
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 1239249,
                    "lower_bound": 1134365,
                    "upper_bound": 1351197
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 344543,
                    "lower_bound": 226094,
                    "upper_bound": 459473
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 402987,
                    "lower_bound": 289351,
                    "upper_bound": 515611
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 325570,
                    "lower_bound": 204598,
                    "upper_bound": 442726
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 435149,
                    "lower_bound": 325811,
                    "upper_bound": 546603
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 638893,
                    "lower_bound": 530528,
                    "upper_bound": 762236
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 418994,
                    "lower_bound": 303862,
                    "upper_bound": 534522
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 394990,
                    "lower_bound": 269662,
                    "upper_bound": 508587
                }
            ]
        },
        {
            "keyword": "pencils",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 165063,
            "annual_growth_rate": 0.1851604844535898,
            "expected_increase_1m": -0.06252061431041456,
            "expected_increase_3m": -0.021856991213539227,
            "expected_increase_6m": 0.07051769943158648,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 165063,
                    "lower_bound": 138426,
                    "upper_bound": 191913
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 154743,
                    "lower_bound": 128897,
                    "upper_bound": 180598
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 170490,
                    "lower_bound": 142569,
                    "upper_bound": 196120
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 159132,
                    "lower_bound": 132585,
                    "upper_bound": 185602
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 173682,
                    "lower_bound": 146256,
                    "upper_bound": 199674
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 198506,
                    "lower_bound": 173833,
                    "upper_bound": 223331
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 203663,
                    "lower_bound": 176658,
                    "upper_bound": 230066
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 151292,
                    "lower_bound": 123759,
                    "upper_bound": 177919
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 185875,
                    "lower_bound": 158629,
                    "upper_bound": 212490
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 267974,
                    "lower_bound": 241446,
                    "upper_bound": 293502
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 250004,
                    "lower_bound": 221808,
                    "upper_bound": 276471
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 219375,
                    "lower_bound": 191935,
                    "upper_bound": 245366
                }
            ]
        },
        {
            "keyword": "school supplies",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 53282,
            "annual_growth_rate": -0.054101540222699654,
            "expected_increase_1m": -0.20469977741477033,
            "expected_increase_3m": -0.2503185931074441,
            "expected_increase_6m": -0.20950122324478018,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 53282,
                    "lower_bound": 40635,
                    "upper_bound": 67261
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 42375,
                    "lower_bound": 29422,
                    "upper_bound": 54833
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 43827,
                    "lower_bound": 30705,
                    "upper_bound": 57131
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 33631,
                    "lower_bound": 20055,
                    "upper_bound": 46988
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 39646,
                    "lower_bound": 27114,
                    "upper_bound": 52012
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 38793,
                    "lower_bound": 25662,
                    "upper_bound": 51570
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 54442,
                    "lower_bound": 41681,
                    "upper_bound": 67489
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 73361,
                    "lower_bound": 59197,
                    "upper_bound": 86658
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 234016,
                    "lower_bound": 220797,
                    "upper_bound": 246752
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 268734,
                    "lower_bound": 255381,
                    "upper_bound": 282940
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 65981,
                    "lower_bound": 53103,
                    "upper_bound": 78316
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 39992,
                    "lower_bound": 27373,
                    "upper_bound": 53296
                }
            ]
        },
        {
            "keyword": "stickers",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 292976,
            "annual_growth_rate": 0.1360234588560332,
            "expected_increase_1m": -0.12782076700238254,
            "expected_increase_3m": -0.09892002406229601,
            "expected_increase_6m": -0.056236198583605436,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 292976,
                    "lower_bound": 264151,
                    "upper_bound": 320923
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 255527,
                    "lower_bound": 226662,
                    "upper_bound": 283943
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 290485,
                    "lower_bound": 261134,
                    "upper_bound": 317973
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 245970,
                    "lower_bound": 217879,
                    "upper_bound": 274403
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 295314,
                    "lower_bound": 267106,
                    "upper_bound": 325553
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 283532,
                    "lower_bound": 256005,
                    "upper_bound": 311393
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 288169,
                    "lower_bound": 260878,
                    "upper_bound": 317357
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 241801,
                    "lower_bound": 213251,
                    "upper_bound": 267396
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 284392,
                    "lower_bound": 256785,
                    "upper_bound": 311708
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 304950,
                    "lower_bound": 277446,
                    "upper_bound": 331964
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 302142,
                    "lower_bound": 273871,
                    "upper_bound": 330794
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 327350,
                    "lower_bound": 298465,
                    "upper_bound": 355716
                }
            ]
        },
        {
            "keyword": "lab books",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 584,
            "annual_growth_rate": 0.09503877883344093,
            "expected_increase_1m": 0.06796321074408844,
            "expected_increase_3m": 0.497642639686748,
            "expected_increase_6m": 0.3399709415721422,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 584,
                    "lower_bound": 481,
                    "upper_bound": 681
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 623,
                    "lower_bound": 517,
                    "upper_bound": 722
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 1193,
                    "lower_bound": 1092,
                    "upper_bound": 1291
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 806,
                    "lower_bound": 709,
                    "upper_bound": 908
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 656,
                    "lower_bound": 557,
                    "upper_bound": 755
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 707,
                    "lower_bound": 603,
                    "upper_bound": 805
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 706,
                    "lower_bound": 602,
                    "upper_bound": 809
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 603,
                    "lower_bound": 501,
                    "upper_bound": 700
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 636,
                    "lower_bound": 527,
                    "upper_bound": 738
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1551,
                    "lower_bound": 1458,
                    "upper_bound": 1653
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 1232,
                    "lower_bound": 1132,
                    "upper_bound": 1339
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 639,
                    "lower_bound": 538,
                    "upper_bound": 736
                }
            ]
        },
        {
            "keyword": "cuff link",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 1819,
            "annual_growth_rate": -0.03909850382879534,
            "expected_increase_1m": -0.016660873953222993,
            "expected_increase_3m": -0.11126591091686516,
            "expected_increase_6m": -0.004894397768100833,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 1819,
                    "lower_bound": 1628,
                    "upper_bound": 1998
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 1788,
                    "lower_bound": 1596,
                    "upper_bound": 1972
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 1594,
                    "lower_bound": 1402,
                    "upper_bound": 1771
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 1466,
                    "lower_bound": 1281,
                    "upper_bound": 1661
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 1633,
                    "lower_bound": 1451,
                    "upper_bound": 1810
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 2184,
                    "lower_bound": 1995,
                    "upper_bound": 2368
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 2192,
                    "lower_bound": 2006,
                    "upper_bound": 2360
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 1659,
                    "lower_bound": 1484,
                    "upper_bound": 1848
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 1557,
                    "lower_bound": 1370,
                    "upper_bound": 1742
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 1471,
                    "lower_bound": 1300,
                    "upper_bound": 1662
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 1742,
                    "lower_bound": 1551,
                    "upper_bound": 1912
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 1933,
                    "lower_bound": 1755,
                    "upper_bound": 2116
                }
            ]
        },
        {
            "keyword": "keyrings",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 8374,
            "annual_growth_rate": 0.13814526431687202,
            "expected_increase_1m": 0.17349685011831423,
            "expected_increase_3m": 0.027266008995064532,
            "expected_increase_6m": 0.03697631205057089,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 8374,
                    "lower_bound": 7730,
                    "upper_bound": 9003
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 9826,
                    "lower_bound": 9269,
                    "upper_bound": 10455
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 8075,
                    "lower_bound": 7467,
                    "upper_bound": 8685
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 7904,
                    "lower_bound": 7325,
                    "upper_bound": 8510
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 8785,
                    "lower_bound": 8164,
                    "upper_bound": 9443
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 8326,
                    "lower_bound": 7735,
                    "upper_bound": 8867
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 9182,
                    "lower_bound": 8578,
                    "upper_bound": 9781
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 8751,
                    "lower_bound": 8046,
                    "upper_bound": 9335
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 9691,
                    "lower_bound": 9065,
                    "upper_bound": 10346
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 10348,
                    "lower_bound": 9708,
                    "upper_bound": 11003
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 9150,
                    "lower_bound": 8527,
                    "upper_bound": 9775
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 9136,
                    "lower_bound": 8538,
                    "upper_bound": 9765
                }
            ]
        },
        {
            "keyword": "magnets",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 44820,
            "annual_growth_rate": -0.33115630812977415,
            "expected_increase_1m": -0.008576507080095736,
            "expected_increase_3m": -0.17585700804042664,
            "expected_increase_6m": -0.18140603140981373,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 44820,
                    "lower_bound": 29176,
                    "upper_bound": 59830
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 44435,
                    "lower_bound": 29103,
                    "upper_bound": 60440
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 36187,
                    "lower_bound": 21157,
                    "upper_bound": 50738
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 30191,
                    "lower_bound": 15831,
                    "upper_bound": 45233
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 37529,
                    "lower_bound": 22082,
                    "upper_bound": 50947
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 34536,
                    "lower_bound": 20896,
                    "upper_bound": 50059
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 37255,
                    "lower_bound": 21882,
                    "upper_bound": 51586
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 39945,
                    "lower_bound": 25554,
                    "upper_bound": 55075
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 34671,
                    "lower_bound": 19468,
                    "upper_bound": 50152
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 37513,
                    "lower_bound": 21932,
                    "upper_bound": 52578
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 31196,
                    "lower_bound": 16852,
                    "upper_bound": 46149
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 28470,
                    "lower_bound": 12663,
                    "upper_bound": 42931
                }
            ]
        },
        {
            "keyword": "license plate frames",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 89209,
            "annual_growth_rate": 0.3765193788784157,
            "expected_increase_1m": -0.06158306553200889,
            "expected_increase_3m": -0.10526273826083664,
            "expected_increase_6m": -0.015854904153449666,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 89209,
                    "lower_bound": 52495,
                    "upper_bound": 125476
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 83715,
                    "lower_bound": 49273,
                    "upper_bound": 122796
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 78170,
                    "lower_bound": 42086,
                    "upper_bound": 115804
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 77570,
                    "lower_bound": 38550,
                    "upper_bound": 108787
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 86704,
                    "lower_bound": 50892,
                    "upper_bound": 121525
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 95314,
                    "lower_bound": 54825,
                    "upper_bound": 132041
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 105292,
                    "lower_bound": 68602,
                    "upper_bound": 142240
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 122336,
                    "lower_bound": 82101,
                    "upper_bound": 158197
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 128914,
                    "lower_bound": 96950,
                    "upper_bound": 166014
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 116198,
                    "lower_bound": 79624,
                    "upper_bound": 153153
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 112538,
                    "lower_bound": 76515,
                    "upper_bound": 152093
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 93347,
                    "lower_bound": 57747,
                    "upper_bound": 129302
                }
            ]
        },
        {
            "keyword": "drinkware",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 10406,
            "annual_growth_rate": -0.15089381949131667,
            "expected_increase_1m": 0.033144788686338515,
            "expected_increase_3m": -0.16278197917027643,
            "expected_increase_6m": -0.22376339847377077,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 10406,
                    "lower_bound": 6832,
                    "upper_bound": 14059
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 10750,
                    "lower_bound": 6874,
                    "upper_bound": 14572
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 8130,
                    "lower_bound": 4411,
                    "upper_bound": 11779
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 7254,
                    "lower_bound": 3297,
                    "upper_bound": 10914
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 6179,
                    "lower_bound": 2565,
                    "upper_bound": 9919
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 6645,
                    "lower_bound": 2878,
                    "upper_bound": 10173
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 9504,
                    "lower_bound": 5808,
                    "upper_bound": 13185
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 7689,
                    "lower_bound": 3931,
                    "upper_bound": 11609
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 7165,
                    "lower_bound": 3565,
                    "upper_bound": 11078
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 7474,
                    "lower_bound": 3527,
                    "upper_bound": 11021
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 7822,
                    "lower_bound": 4096,
                    "upper_bound": 11526
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 8538,
                    "lower_bound": 4587,
                    "upper_bound": 12246
                }
            ]
        },
        {
            "keyword": "golf towel",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 19768,
            "annual_growth_rate": 0.06303322506928749,
            "expected_increase_1m": 0.22609265953130844,
            "expected_increase_3m": -0.1574090602919952,
            "expected_increase_6m": 0.030973994475999057,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 19768,
                    "lower_bound": 17922,
                    "upper_bound": 21662
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 24237,
                    "lower_bound": 22257,
                    "upper_bound": 26124
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 12317,
                    "lower_bound": 10360,
                    "upper_bound": 14128
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 13413,
                    "lower_bound": 11449,
                    "upper_bound": 15297
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 20408,
                    "lower_bound": 18363,
                    "upper_bound": 22397
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 25287,
                    "lower_bound": 23312,
                    "upper_bound": 27198
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 26616,
                    "lower_bound": 24768,
                    "upper_bound": 28504
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 27223,
                    "lower_bound": 25345,
                    "upper_bound": 29220
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 26476,
                    "lower_bound": 24689,
                    "upper_bound": 28511
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 24588,
                    "lower_bound": 22599,
                    "upper_bound": 26457
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 16601,
                    "lower_bound": 14695,
                    "upper_bound": 18698
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 13616,
                    "lower_bound": 11704,
                    "upper_bound": 15547
                }
            ]
        },
        {
            "keyword": "caps",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 346784,
            "annual_growth_rate": 0.08312483809166363,
            "expected_increase_1m": 0.010878043314088197,
            "expected_increase_3m": -0.001154075436112832,
            "expected_increase_6m": 0.09532125127030341,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 346784,
                    "lower_bound": 319411,
                    "upper_bound": 372727
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 350556,
                    "lower_bound": 323470,
                    "upper_bound": 377591
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 354228,
                    "lower_bound": 326398,
                    "upper_bound": 380526
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 334366,
                    "lower_bound": 307835,
                    "upper_bound": 361918
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 382208,
                    "lower_bound": 355672,
                    "upper_bound": 408950
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 413006,
                    "lower_bound": 386790,
                    "upper_bound": 439698
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 444672,
                    "lower_bound": 417797,
                    "upper_bound": 470076
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 331390,
                    "lower_bound": 302854,
                    "upper_bound": 357955
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 335252,
                    "lower_bound": 305882,
                    "upper_bound": 366081
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 363806,
                    "lower_bound": 333503,
                    "upper_bound": 390830
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 337190,
                    "lower_bound": 309001,
                    "upper_bound": 366120
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 386693,
                    "lower_bound": 360652,
                    "upper_bound": 415006
                }
            ]
        },
        {
            "keyword": "gift cards",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 496539,
            "annual_growth_rate": 0.004254293564048229,
            "expected_increase_1m": 0.5586408390460734,
            "expected_increase_3m": -0.2159773556275011,
            "expected_increase_6m": -0.4035255157430369,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 496539,
                    "lower_bound": 431463,
                    "upper_bound": 566803
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 773925,
                    "lower_bound": 707273,
                    "upper_bound": 841506
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 213497,
                    "lower_bound": 146115,
                    "upper_bound": 279978
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 180470,
                    "lower_bound": 113216,
                    "upper_bound": 250213
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 184547,
                    "lower_bound": 119195,
                    "upper_bound": 249664
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 191180,
                    "lower_bound": 129560,
                    "upper_bound": 256764
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 233415,
                    "lower_bound": 170585,
                    "upper_bound": 301320
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 229106,
                    "lower_bound": 159353,
                    "upper_bound": 295403
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 210512,
                    "lower_bound": 143939,
                    "upper_bound": 278956
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 210553,
                    "lower_bound": 142707,
                    "upper_bound": 275416
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 208983,
                    "lower_bound": 141255,
                    "upper_bound": 273877
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 249595,
                    "lower_bound": 180344,
                    "upper_bound": 310949
                }
            ]
        },
        {
            "keyword": "gifts",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 608085,
            "annual_growth_rate": 0.1791420370098086,
            "expected_increase_1m": 0.5527919760914254,
            "expected_increase_3m": -0.17927493027691746,
            "expected_increase_6m": -0.3720439227307819,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 608085,
                    "lower_bound": 559513,
                    "upper_bound": 656980
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 944229,
                    "lower_bound": 896386,
                    "upper_bound": 992172
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 313629,
                    "lower_bound": 261627,
                    "upper_bound": 363120
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 239353,
                    "lower_bound": 191875,
                    "upper_bound": 286670
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 248241,
                    "lower_bound": 195823,
                    "upper_bound": 296145
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 267963,
                    "lower_bound": 218700,
                    "upper_bound": 316328
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 277687,
                    "lower_bound": 223816,
                    "upper_bound": 326181
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 250763,
                    "lower_bound": 198393,
                    "upper_bound": 294233
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 285852,
                    "lower_bound": 237836,
                    "upper_bound": 337805
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 286521,
                    "lower_bound": 237249,
                    "upper_bound": 336527
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 293654,
                    "lower_bound": 245907,
                    "upper_bound": 343104
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 469474,
                    "lower_bound": 421299,
                    "upper_bound": 520699
                }
            ]
        },
        {
            "keyword": "decals",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 36105,
            "annual_growth_rate": -0.08917047785725306,
            "expected_increase_1m": -0.06519335167492177,
            "expected_increase_3m": 0.00044533151391620813,
            "expected_increase_6m": 0.05555965789170854,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 36105,
                    "lower_bound": 30797,
                    "upper_bound": 41009
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 33751,
                    "lower_bound": 28699,
                    "upper_bound": 39007
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 40911,
                    "lower_bound": 35563,
                    "upper_bound": 45958
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 33700,
                    "lower_bound": 28480,
                    "upper_bound": 38681
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 41003,
                    "lower_bound": 35860,
                    "upper_bound": 46399
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 37178,
                    "lower_bound": 31922,
                    "upper_bound": 42468
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 42120,
                    "lower_bound": 36809,
                    "upper_bound": 47627
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 36222,
                    "lower_bound": 31226,
                    "upper_bound": 41747
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 39385,
                    "lower_bound": 34218,
                    "upper_bound": 44756
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 43392,
                    "lower_bound": 38190,
                    "upper_bound": 48629
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 36108,
                    "lower_bound": 30896,
                    "upper_bound": 41313
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 32436,
                    "lower_bound": 27121,
                    "upper_bound": 37817
                }
            ]
        },
        {
            "keyword": "flags",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 302459,
            "annual_growth_rate": 0.005136994779093206,
            "expected_increase_1m": -0.14837668110590577,
            "expected_increase_3m": -0.12602325128987227,
            "expected_increase_6m": -0.0040660939996631385,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 302459,
                    "lower_bound": 255175,
                    "upper_bound": 347015
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 257581,
                    "lower_bound": 211469,
                    "upper_bound": 302901
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 265304,
                    "lower_bound": 221810,
                    "upper_bound": 311747
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 270141,
                    "lower_bound": 227961,
                    "upper_bound": 312780
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 306878,
                    "lower_bound": 264265,
                    "upper_bound": 354626
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 327290,
                    "lower_bound": 278180,
                    "upper_bound": 370988
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 380179,
                    "lower_bound": 332763,
                    "upper_bound": 423304
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 344530,
                    "lower_bound": 301988,
                    "upper_bound": 392869
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 337675,
                    "lower_bound": 291549,
                    "upper_bound": 380714
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 287328,
                    "lower_bound": 241818,
                    "upper_bound": 329129
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 296727,
                    "lower_bound": 251983,
                    "upper_bound": 342892
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 312756,
                    "lower_bound": 271039,
                    "upper_bound": 356875
                }
            ]
        },
        {
            "keyword": "pet supplies",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 11255,
            "annual_growth_rate": -0.7694240886516607,
            "expected_increase_1m": 0.1967393559732621,
            "expected_increase_3m": 0.3375882567481114,
            "expected_increase_6m": 0.2739191877808813,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 11255,
                    "lower_bound": 0,
                    "upper_bound": 150202
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 13469,
                    "lower_bound": 0,
                    "upper_bound": 145947
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 16034,
                    "lower_bound": 0,
                    "upper_bound": 153842
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 15659,
                    "lower_bound": 0,
                    "upper_bound": 146298
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 10969,
                    "lower_bound": 0,
                    "upper_bound": 141214
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 13695,
                    "lower_bound": 0,
                    "upper_bound": 138174
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 16199,
                    "lower_bound": 0,
                    "upper_bound": 137953
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 21445,
                    "lower_bound": 0,
                    "upper_bound": 150363
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 22037,
                    "lower_bound": 0,
                    "upper_bound": 152459
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 21055,
                    "lower_bound": 0,
                    "upper_bound": 145766
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 21661,
                    "lower_bound": 0,
                    "upper_bound": 157474
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 249538,
                    "lower_bound": 55821,
                    "upper_bound": 428249
                }
            ]
        },
        {
            "keyword": "plush toys",
            "prophet_model_status": "Prophet (Seasonality: Multiplicative)",
            "current_month_expected_volume": 81229,
            "annual_growth_rate": -0.012637426541479193,
            "expected_increase_1m": 0.08399186174796992,
            "expected_increase_3m": -0.1709239142863094,
            "expected_increase_6m": -0.2743521285445334,
            "forecast_series": [
                {
                    "month": "NOVEMBER",
                    "year": 2025,
                    "search_volume_forecast": 81229,
                    "lower_bound": 33510,
                    "upper_bound": 130198
                },
                {
                    "month": "DECEMBER",
                    "year": 2025,
                    "search_volume_forecast": 88051,
                    "lower_bound": 37211,
                    "upper_bound": 133676
                },
                {
                    "month": "JANUARY",
                    "year": 2026,
                    "search_volume_forecast": 58046,
                    "lower_bound": 4538,
                    "upper_bound": 106295
                },
                {
                    "month": "FEBRUARY",
                    "year": 2026,
                    "search_volume_forecast": 55937,
                    "lower_bound": 4687,
                    "upper_bound": 104967
                },
                {
                    "month": "MARCH",
                    "year": 2026,
                    "search_volume_forecast": 75200,
                    "lower_bound": 24804,
                    "upper_bound": 125764
                },
                {
                    "month": "APRIL",
                    "year": 2026,
                    "search_volume_forecast": 43082,
                    "lower_bound": 0,
                    "upper_bound": 93515
                },
                {
                    "month": "MAY",
                    "year": 2026,
                    "search_volume_forecast": 33344,
                    "lower_bound": 0,
                    "upper_bound": 81878
                },
                {
                    "month": "JUNE",
                    "year": 2026,
                    "search_volume_forecast": 124963,
                    "lower_bound": 73938,
                    "upper_bound": 176124
                },
                {
                    "month": "JULY",
                    "year": 2026,
                    "search_volume_forecast": 66324,
                    "lower_bound": 15308,
                    "upper_bound": 117789
                },
                {
                    "month": "AUGUST",
                    "year": 2026,
                    "search_volume_forecast": 139786,
                    "lower_bound": 92916,
                    "upper_bound": 186064
                },
                {
                    "month": "SEPTEMBER",
                    "year": 2026,
                    "search_volume_forecast": 144757,
                    "lower_bound": 98231,
                    "upper_bound": 196821
                },
                {
                    "month": "OCTOBER",
                    "year": 2026,
                    "search_volume_forecast": 71702,
                    "lower_bound": 15808,
                    "upper_bound": 120586
                }
            ]
        }
    ]
}

export const MOCK_SCANNER_RESPONSE: ScannerResponse = {
    "structured_data": [
        {
            "category_name": "Apparel",
            "groups": [
                {
                    "group_name": "Themed T-Shirts",
                    "keywords": [
                        "2025 caltech dad tee",
                        "at the beach tee",
                        "basketball spectrum tee",
                        "being smart tee",
                        "cheat sheet tee",
                        "expecto palms tee",
                        "hk shine the light tee",
                        "ligo tee",
                        "mit tee",
                        "mountains tee",
                        "spectrum baseball tee",
                        "spectrum cross country tee",
                        "tennis spectrum tee",
                        "volleyball spectrum tee",
                        "waterpolo spectrum tee",
                        "waves tee",
                        "youth being smart tee",
                        "zhang tee"
                    ]
                },
                {
                    "group_name": "Kids Apparel",
                    "keywords": [
                        "beaver rocket onesie",
                        "kids clothing"
                    ]
                },
                {
                    "group_name": "Casual Outerwear",
                    "keywords": [
                        "jacket",
                        "shorts",
                        "sleeves"
                    ]
                },
                {
                    "group_name": "Accessories",
                    "keywords": [
                        "beanies",
                        "mark cuff links",
                        "mark lapel pin",
                        "mark money clip"
                    ]
                },
                {
                    "group_name": "Ladies Apparel",
                    "keywords": [
                        "ladies clothing",
                        "galaxy pants",
                        "triblend mark tee"
                    ]
                }
            ]
        },
        {
            "category_name": "Electronics",
            "groups": [
                {
                    "group_name": "Apple Computers and Accessories",
                    "keywords": [
                        "apple computers",
                        "ipads"
                    ]
                },
                {
                    "group_name": "Lenovo Computers and Accessories",
                    "keywords": [
                        "lenovo computers"
                    ]
                },
                {
                    "group_name": "Cables and Adapters",
                    "keywords": [
                        "adapters",
                        "cables",
                        "usb storage"
                    ]
                },
                {
                    "group_name": "General Technology",
                    "keywords": [
                        "technology"
                    ]
                }
            ]
        },
        {
            "category_name": "School Supplies",
            "groups": [
                {
                    "group_name": "Essential Back-to-School Supplies",
                    "keywords": [
                        "backpacks",
                        "folders",
                        "notebooks",
                        "pencils",
                        "school supplies"
                    ]
                },
                {
                    "group_name": "Creative School Stationery",
                    "keywords": [
                        "stickers",
                        "lab books"
                    ]
                }
            ]
        },
        {
            "category_name": "Gifts & Accessories",
            "groups": [
                {
                    "group_name": "Alumni Merchandise",
                    "keywords": [
                        "alumni chrome engraved license plate",
                        "alumni page",
                        "alumni patch",
                        "alumni wood magnet",
                        "caltech alumni decal",
                        "minolo alumni mug"
                    ]
                },
                {
                    "group_name": "Personalized Gifts",
                    "keywords": [
                        "cuff link",
                        "keyrings",
                        "magnets",
                        "license plate frames"
                    ]
                },
                {
                    "group_name": "Drinkware & Accessories",
                    "keywords": [
                        "drinkware",
                        "golf towel",
                        "caps"
                    ]
                },
                {
                    "group_name": "Gift Cards & General Gifts",
                    "keywords": [
                        "gift cards",
                        "gifts"
                    ]
                },
                {
                    "group_name": "Decorative Decals & Flags",
                    "keywords": [
                        "decals",
                        "flags"
                    ]
                }
            ]
        },
        {
            "category_name": "Sports & Outdoor",
            "groups": [
                {
                    "group_name": "Athletics Events",
                    "keywords": [
                        "athletics page",
                        "legends of caltech i",
                        "legends of caltech iii"
                    ]
                },
                {
                    "group_name": "Sports Apparel",
                    "keywords": [
                        "soccer spectrum tee",
                        "swimming spectrum tee"
                    ]
                },
                {
                    "group_name": "Pet Supplies & Toys",
                    "keywords": [
                        "pet supplies",
                        "plush toys"
                    ]
                }
            ]
        }
    ],
    "crawl_stats": {
        "pages_crawled": 80,
        "pages_failed": 0,
        "total_links_found": 379,
        "crawl_duration_seconds": 36.46,
        "average_page_size_bytes": 47532.88,
        "robots_txt_found": true,
        "max_depth_reached": 2
    },
    "llm_metrics": {
        "total_tokens": 10163,
        "phase_metrics": {
            "keyword_extraction": {
                "time_taken_seconds": 15.571630001068115,
                "tokens_used": 5101,
                "api_calls": 1
            },
            "category_generation": {
                "time_taken_seconds": 2.771360158920288,
                "tokens_used": 718,
                "api_calls": 1
            },
            "keyword_categorization": {
                "time_taken_seconds": 12.202903985977173,
                "tokens_used": 1227,
                "api_calls": 1
            },
            "keyword_grouping": {
                "time_taken_seconds": 10.299421310424805,
                "tokens_used": 3117,
                "api_calls": 5
            }
        }
    }
};