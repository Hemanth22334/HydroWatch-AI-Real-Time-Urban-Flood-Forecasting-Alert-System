import os
import sys

def install_and_import(package):
    import importlib
    try:
        importlib.import_module(package)
    except ImportError:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

install_and_import("reportlab")

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdf_filename = "HydroWatch_AI_Technologies_Guide.pdf"
pdf_path = os.path.join(os.getcwd(), pdf_filename)

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=40,
    leftMargin=40,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom Styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=colors.HexColor('#4F00BC'),
    spaceAfter=6
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#64748B'),
    spaceAfter=15
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#A100B2'),
    spaceBefore=12,
    spaceAfter=6
)

tech_title = ParagraphStyle(
    'TechTitle',
    parent=styles['Heading3'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#0F172A'),
    spaceAfter=2
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor('#334155'),
    spaceAfter=8
)

bullet_style = ParagraphStyle(
    'BulletCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#475569')
)

elements = []

# Title Banner
elements.append(Paragraph("HydroWatch AI — Technology Stack Guide", title_style))
elements.append(Paragraph("A brief overview of all core technologies, frameworks, and libraries used.", subtitle_style))
elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#FF3B77'), spaceAfter=15))

# Tech Stack Items Data
tech_data = [
    {
        "cat": "1. BACKEND & PROGRAMMING LANGUAGE",
        "items": [
            ("Python", "What it is: A high-level, versatile programming language known for readability.\nWhy used: Serves as the core language for machine learning modeling, data processing, and backend API logic."),
            ("Flask Framework", "What it is: A lightweight Python Web Server Interface (WSGI) micro-framework.\nWhy used: Powers the RESTful API endpoints (/predict-flood, /fetch-city-weather, /fetch-future-forecast) to handle requests fast.")
        ]
    },
    {
        "cat": "2. MACHINE LEARNING & DATA SCIENCE",
        "items": [
            ("Scikit-Learn (scikit-learn)", "What it is: Python's premier machine learning & data mining library.\nWhy used: Implements the Random Forest Classifier (100 decision trees) to evaluate rainfall, river stage, and humidity."),
            ("NumPy", "What it is: High-performance scientific computing package for n-dimensional array math.\nWhy used: Formats feature vectors and handles matrix operations for instant microsecond model predictions."),
            ("Joblib", "What it is: Optimization tool for Python object serialization and disk caching.\nWhy used: Saves trained machine learning model artifacts (flood_model.joblib) to disk for instant preloading.")
        ]
    },
    {
        "cat": "3. FRONTEND UI & USER EXPERIENCE",
        "items": [
            ("React.js (v18)", "What it is: A component-based JavaScript library for building interactive user interfaces.\nWhy used: Manages multi-page client navigation, real-time input state, and live UI dashboard rendering."),
            ("Tailwind CSS (v3)", "What it is: A utility-first CSS framework for rapid custom UI design.\nWhy used: Provides responsive layouts, glassmorphism card styling, custom color themes, and smooth animations."),
            ("Lucide React Icons", "What it is: A modern, clean open-source vector icon set for React.\nWhy used: Renders hydrological & meteorological icons (Shield, Rain, Waves, Droplet, Clock, Newspaper)."),
            ("Recharts", "What it is: A composable data visualization chart library built for React components.\nWhy used: Renders interactive Area Charts (rainfall risk sensitivity curves) and Bar Charts (danger threshold benchmarks).")
        ]
    },
    {
        "cat": "4. EXTERNAL APIs & INTEGRATIONS",
        "items": [
            ("Open-Meteo REST API", "What it is: A free global weather forecast and geocoding REST service requiring 0 API keys.\nWhy used: Provides real-time city geocoding, current rainfall/humidity telemetry, and 24-hour hourly forecast timelines.")
        ]
    }
]

for section in tech_data:
    elements.append(Paragraph(section["cat"], section_heading))
    for name, desc in section["items"]:
        content = f"<b>{name}</b><br/>{desc.replace('\n', '<br/>')}"
        elements.append(Paragraph(content, body_style))
        elements.append(Spacer(1, 4))
    elements.append(Spacer(1, 6))

elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=10, spaceAfter=10))
elements.append(Paragraph("<b>Summary:</b> This technology stack combines Python's ML strength with React's fast UI rendering to deliver a robust, sub-50ms flood forecasting platform.", subtitle_style))

doc.build(elements)
print(f"PDF successfully generated at: {pdf_path}")
