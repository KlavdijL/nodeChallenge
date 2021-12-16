APi call examples:
    /health
    curl --request GET \
        --url http://localhost:8000/health
    /user/register
    curl --request POST \
      --url http://localhost:8000/user/register \
      --header 'Content-Type: application/x-www-form-urlencoded' \
      --data email=email@email.si \
      --data password=geslo \
      --data repeatPassword=geslo \
      --data first_name=Ime \
      --data last_name=Priimek
    /user/login
    curl --request POST \
      --url http://localhost:8000/user/login \
      --header 'Content-Type: application/x-www-form-urlencoded' \
      --data email=klavdij8@gmail.com \
      --data password=geslo
    /user/update
    curl --request POST \
      --url http://localhost:8000/user/update \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtsYXZkaWo4QGdtYWlsLmNvbSIsImFkbWluIjoiMSIsImlhdCI6MTYzOTMyODk4NCwiZXhwIjoxNjM5NTAxNzg0fQ.7DFqoUqZzrPlwqPC1xmfH-6akDd38qlzDh4qA-EJeFE' \
      --header 'Content-Type: application/x-www-form-urlencoded' \
      --data email=email@email.si \
      --data password=geslo \
      --data 'first_name=Novo ime' \
      --data last_name=Priimek
    /user/delete
    curl --request POST \
      --url http://localhost:8000/user/delete \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtsYXZkaWo4QGdtYWlsLmNvbSIsImFkbWluIjoiMSIsImlhdCI6MTYzOTMyODk4NCwiZXhwIjoxNjM5NTAxNzg0fQ.7DFqoUqZzrPlwqPC1xmfH-6akDd38qlzDh4qA-EJeFE' \
      --header 'Content-Type: application/x-www-form-urlencoded' \
      --data email=email@email.si
     /drugs
    curl --request GET \
        --url http://localhost:8000/drugs \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtsYXZkaWo4QGdtYWlsLmNvbSIsImFkbWluIjoiMSIsImlhdCI6MTYzOTMyODk4NCwiZXhwIjoxNjM5NTAxNzg0fQ.7DFqoUqZzrPlwqPC1xmfH-6akDd38qlzDh4qA-EJeFE'
    /drugs/:drugID
    curl --request GET \
        --url http://localhost:8000/drugs/4 \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtsYXZkaWo4QGdtYWlsLmNvbSIsImFkbWluIjoiMSIsImlhdCI6MTYzOTMyODk4NCwiZXhwIjoxNjM5NTAxNzg0fQ.7DFqoUqZzrPlwqPC1xmfH-6akDd38qlzDh4qA-EJeFE'
    /tools/:toolID
    curl --request POST \
        --url http://localhost:8000/tools/BMI \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtsYXZkaWo4QGdtYWlsLmNvbSIsImFkbWluIjoiMSIsImlhdCI6MTYzOTMyODk4NCwiZXhwIjoxNjM5NTAxNzg0fQ.7DFqoUqZzrPlwqPC1xmfH-6akDd38qlzDh4qA-EJeFE' \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data height=1.88 \
        --data weight=90
