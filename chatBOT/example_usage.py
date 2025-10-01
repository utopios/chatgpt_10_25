#!/usr/bin/env python3
"""
Exemple d'utilisation avancée du chatbot
"""

from chatbot_gpt import ChatBot
import os
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

def exemple_simple():
    """Exemple d'utilisation simple"""
    print("=== Exemple Simple ===\n")
    
    bot = ChatBot(model="gpt-4o-mini")
    bot.set_system_prompt("Tu es un assistant technique spécialisé en Python.")
    
    questions = [
        "Qu'est-ce qu'une liste en Python?",
        "Comment créer un dictionnaire?",
        "Quelle est la différence entre une liste et un tuple?"
    ]
    
    for question in questions:
        print(f"Q: {question}")
        response = bot.chat(question)
        print(f"R: {response}\n")


def exemple_service_client():
    """Exemple d'un bot de service client"""
    print("=== Exemple Service Client ===\n")
    
    bot = ChatBot(model="gpt-4o-mini")
    bot.set_system_prompt(
        "Tu es un agent du service client pour une entreprise tech. "
        "Tu es poli, professionnel et tu essaies de résoudre les problèmes des clients. "
        "Si tu ne connais pas la réponse, tu proposes de transférer vers un superviseur."
    )
    
    conversations = [
        "Bonjour, j'ai un problème avec ma commande",
        "Je n'ai pas reçu mon produit",
        "Pouvez-vous vérifier le statut?"
    ]
    
    for message in conversations:
        print(f"Client: {message}")
        response = bot.chat(message)
        print(f"Agent: {response}\n")


def exemple_avec_contexte():
    """Exemple montrant la conservation du contexte"""
    print("=== Exemple avec Contexte ===\n")
    
    bot = ChatBot(model="gpt-4o-mini")
    
    # Première question
    response1 = bot.chat("Mon prénom est Jean et j'habite à Paris")
    print(f"Bot: {response1}\n")
    
    # Question suivante qui fait référence au contexte
    response2 = bot.chat("Quel est mon prénom?")
    print(f"Bot: {response2}\n")
    
    response3 = bot.chat("Et où j'habite?")
    print(f"Bot: {response3}\n")


def exemple_streaming():
    """Exemple avec réponse en streaming (pour les longues réponses)"""
    print("=== Exemple Streaming ===\n")
    
    from openai import OpenAI
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    print("Question: Explique-moi le machine learning en détail\n")
    print("Bot: ", end="", flush=True)
    
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": "Explique-moi le machine learning en 3 paragraphes"}
        ],
        stream=True,
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    
    print("\n")


def exemple_fonction_specifique():
    """Exemple d'un bot avec une fonction spécifique (traducteur)"""
    print("=== Exemple Traducteur ===\n")
    
    bot = ChatBot(model="gpt-4o-mini")
    bot.set_system_prompt(
        "Tu es un traducteur professionnel. "
        "Traduis le texte qu'on te donne vers la langue demandée. "
        "Ne fournis que la traduction, sans explications additionnelles."
    )
    
    texte = "La vie est belle"
    langues = ["anglais", "espagnol", "allemand"]
    
    for langue in langues:
        response = bot.chat(f"Traduis en {langue}: {texte}")
        print(f"{langue.capitalize()}: {response}")
    
    print()


if __name__ == "__main__":
    try:
        print("Exemples d'utilisation du ChatBot GPT\n")
        print("=" * 50 + "\n")
        
        # Exécute les différents exemples
        exemple_simple()
        input("Appuyez sur Entrée pour continuer...")
        
        exemple_service_client()
        input("Appuyez sur Entrée pour continuer...")
        
        exemple_avec_contexte()
        input("Appuyez sur Entrée pour continuer...")
        
        exemple_fonction_specifique()
        input("Appuyez sur Entrée pour continuer...")
        
        exemple_streaming()
        
        print("\n" + "=" * 50)
        print("Exemples terminés!")
        
    except Exception as e:
        print(f"Erreur: {e}")
        print("\nAssurez-vous d'avoir défini votre clé API OpenAI dans le fichier .env")