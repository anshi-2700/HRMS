import pytest
from django.urls import reverse
from django.db.utils import OperationalError
from unittest.mock import patch

@pytest.mark.django_db
def test_health_check_endpoint_healthy(client):
    url = reverse('main:health_check')
    response = client.get(url)
    
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "connected"}


@pytest.mark.django_db
def test_health_check_endpoint_unhealthy(client):
    url = reverse('main:health_check')
    
    with patch('django.db.connection.cursor') as mock_cursor:
        mock_cursor.side_effect = OperationalError("Simulated connection failure")
        response = client.get(url)
        
    assert response.status_code == 503
    assert response.json() == {"status": "unhealthy", "database": "unreachable"}