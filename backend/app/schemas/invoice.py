from pydantic import BaseModel
from typing import List

class ChartDataPoint(BaseModel):
    label: str
    value: float

class ExpenseRecommendation(BaseModel):
    title: str
    description: str

class InvoiceAnalysisResult(BaseModel):
    total_amount: float
    chart_data: List[ChartDataPoint]
    recommendations: List[ExpenseRecommendation]