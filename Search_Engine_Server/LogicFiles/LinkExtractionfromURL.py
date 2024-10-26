import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

base_url = "https://techcrunch.com/"
start_date = datetime(2019, 8, 3)
end_date = datetime(2019, 8, 10)

current_date = start_date

while current_date <= end_date:
    formatted_date = current_date.strftime("%Y/%m/%d")
    url = f"{base_url}{formatted_date}"a

  
    response = requests.get(url)

    if response.status_code == 200:
      
        soup = BeautifulSoup(response.text, 'html.parser')

       
        h2_tags = soup.find_all('h2', class_='post-block__title')

      
        with open("missed.txt", "a", encoding="utf-8") as output_file:  # Use "a" to append instead of "w" to overwrite
            for h2_tag in h2_tags:
                a_tag = h2_tag.find('a', class_='post-block__title__link')
                if a_tag:
                    href_value = a_tag.get('href')
                    output_file.write(href_value + "\n")

        print(f"Hrefs for {formatted_date} have been extracted and saved to missed.txt")

    else:
        print(f"Failed to retrieve data for {formatted_date}")

   
    current_date += timedelta(days=1)
