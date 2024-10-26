import requests
from bs4 import BeautifulSoup
import csv


def extract_data_from_url(url):
    try:
        response = requests.get(url, allow_redirects=True)
        response.raise_for_status() 
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            
            title_element = soup.find('h1', class_='article__title')
            title = title_element.text.strip() if title_element else 'No title found'

          
            content_element = soup.find('div', class_='article-content')
            if content_element:
             
                for tag in content_element.find_all():
                    tag.unwrap()

                content = content_element.text.strip()
            else:
                content = 'No content found'

            return title, content
        else:
            print(f"Error: {response.status_code} - {url}")
            return None, None
    except requests.exceptions.RequestException as e:
        print(f"Error: {e} - {url}")
        return None, None

with open("o2.txt", "r", encoding="utf-8") as url_file:
    urls = url_file.read().splitlines()


csv_file_path = "output2.csv"
with open(csv_file_path, mode='w', encoding='utf-8', newline='') as csv_file:
    fieldnames = ['URL', 'Title', 'Content']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()


    for i, url in enumerate(urls, start=1):
        title, content = extract_data_from_url(url)

      
        writer.writerow({'URL': url, 'Title': title, 'Content': content})

      
        print(f"Processed line {i}: {url}")

print(f"Data saved to {csv_file_path}")
