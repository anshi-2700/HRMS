from apps.main.functions import get_current_company

def main_context(request):
    current_company = get_current_company(request)
    return {
        'app_title' : "NEXUS WORKFORCE OS",
        'company' : current_company
    }





