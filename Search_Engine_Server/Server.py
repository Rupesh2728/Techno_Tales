from flask import Flask, g
from flask import Flask, request, jsonify
from flask_cors import CORS

import json
import math
from collections import defaultdict
import spacy
from collections import Counter

app = Flask(__name__)
cors = CORS(app, origins='http://localhost:3000')
data_loaded = False

inverted_index_file_path = './IRDataset/JsonFiles/inverted_index.json'
idf_file_path = './IRDataset/JsonFiles/idf_values.json'
doc_id_mapper_path = './IRDataset/JsonFiles/docId_mapper.json'
doc_vectors_file_path = './IRDataset/JsonFiles/doc_vectors.json'

print("Please wait, The Files are loading in to the server....")
with open(inverted_index_file_path, 'r') as json_file:
    inverted_index = json.load(json_file)

with open(idf_file_path, 'r') as json_file:
    idf_values = json.load(json_file)

with open(doc_id_mapper_path, 'r') as json_file:
    doc_id_mapper = json.load(json_file)

with open(doc_vectors_file_path, 'r') as json_file:
    doc_vectors = json.load(json_file)

nlp = spacy.load("en_core_web_sm")

print("The Files are Loaded in to the Server.....")

def process_query(query):
    query = query.lower().strip()
    doc = nlp(query)
    query_tokens = [token.lemma_ for token in doc if not token.is_stop and token.is_alpha]
    return query_tokens


def build_query_vector(query_tokens, idf_values):
    query_vector = {}
    max_term_freq = max(Counter(query_tokens).values(), default=1)
    
    for term in set(query_tokens):
        tf = Counter(query_tokens)[term] / max_term_freq
        idf = idf_values.get(term, 0)
        query_vector[term] = tf * idf
    
    return query_vector


def cosine_similarity(query_vector, doc_vector):
    dot_product = sum(query_vector[term] * doc_vector.get(term, 0) for term in set(query_vector) & set(doc_vector))
    query_norm = math.sqrt(sum(weight**2 for weight in query_vector.values()))
    doc_norm = math.sqrt(sum(weight**2 for weight in doc_vector.values()))
    
    if query_norm == 0 or doc_norm == 0:
        return 0  
    
    similarity = dot_product / (query_norm * doc_norm)
    return similarity        

       
def searchforresults(query):
     
     user_query = query
     processed_query = process_query(user_query)
     query_vector = build_query_vector(processed_query, idf_values)


     document_scores = {}

     for doc_id, doc_vector in doc_vectors.items():
        similarity = cosine_similarity(query_vector, doc_vector)
        document_scores[doc_id] = similarity

     ranked_docs = sorted(document_scores.items(), key=lambda x: x[1], reverse=True)


     top_10_document_ids = [doc_id for doc_id, _ in ranked_docs[:10]]

     results_file_path = './IRDataset/JsonFiles/query_results.json'
     with open(results_file_path, 'w') as results_file:
       json.dump(top_10_document_ids, results_file, indent=2)

     print(f'Top 10 Document IDs stored in {results_file_path}')
     return {"k":1}



def extract_details_from_mapper(query_results_file, doc_mapper_file, output_file,query):
  
    with open(query_results_file, 'r') as results_file:
        doc_ids = json.load(results_file)

   
    with open(doc_mapper_file, 'r') as mapper_file:
        doc_mapper = json.load(mapper_file)

   
    details = {}
    count=1
    for doc_id in doc_ids:
        try:
            doc_info = doc_mapper[str(doc_id)]
            url = doc_info.get('URL')
            title = doc_info.get('Title')
            small_content = doc_info.get('First_10_Words')
            
            details[count] = {
                "docId": doc_id,
                "URL": url,
                "Title": title,
                "First_20_Words": small_content
            }

            count+=1
        except KeyError:
            print(f"Warning: No entry found for docId {doc_id} in the docId_mapper.json file.")

    
    output_data = {"query": query, "details": details}
    with open(output_file, 'w') as output_json:
        json.dump(output_data, output_json, indent=2)





query_results_file_path = './IRDataset/JsonFiles/query_results.json'
doc_mapper_file_path = './IRDataset/JsonFiles/docId_mapper.json'
output_file_path = './IRDataset/JsonFiles/output.json'



@app.route('/', methods=['POST'])
def entered_query():
    reqobj=request.json
    query=reqobj['query']
    print(query)
    res=searchforresults(query)
    extract_details_from_mapper(query_results_file_path, doc_mapper_file_path, output_file_path,query)
    return jsonify(res)

@app.route('/results',methods=['GET'])   
def return_results(): 
    with open('./IRDataset/JsonFiles/output.json', 'r') as results_file:
        output = json.load(results_file)
    return jsonify(output)




global result_array
result_array = []

def Evaluation(relevance_feedback):
    for rank in relevance_feedback:
      entry = relevance_feedback[rank]
      retrieved_relevant_count = int(rank)
      relevant_count = sum(1 for feedback in list(relevance_feedback.values())[:int(rank)] if feedback['relavance'] == 1)

      precision = relevant_count / retrieved_relevant_count if retrieved_relevant_count > 0 else 0
      recall = relevant_count / len(relevance_feedback)

      result_array.append({
        'rank': int(rank),
        'docId': entry['docId'],
        'relevance': entry['relavance'],
        'precision': round(precision, 4),
        'recall': round(recall, 4),
       })

    with open('./IRDataset/JsonFiles/evaluation.json', 'w') as json_file:
      json.dump(result_array, json_file, indent=2)
  

        

@app.route('/relavance',methods=['POST'])   
def get_relavance(): 
    reqobj=request.json
    relavanceobj=reqobj['relavance_obj']
    Evaluation(relavanceobj)
    print(relavanceobj)
    return jsonify({"k":1})

@app.route('/evaluation',methods=['GET'])   
def return_evaluation_results(): 
    with open('./IRDataset/JsonFiles/evaluation.json', 'r') as results_file:
        output = json.load(results_file)
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
