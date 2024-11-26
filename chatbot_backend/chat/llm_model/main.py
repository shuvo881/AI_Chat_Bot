from langchain_ollama import OllamaLLM

def get_response(query):
    llm = OllamaLLM(model='llama3.2')
    response = llm.invoke(query)
    return response

