#!/usr/bin/env python3
"""
Chatbot utilisant l'API OpenAI ChatGPT
"""

import os
from openai import OpenAI

class ChatBot:
    def __init__(self, api_key=None, model="gpt-4o-mini"):
        """
        Initialise le chatbot
        
        Args:
            api_key: Clé API OpenAI (si None, utilise la variable d'environnement OPENAI_API_KEY)
            model: Modèle à utiliser (gpt-4o, gpt-4o-mini, gpt-3.5-turbo, etc.)
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("Clé API OpenAI requise. Définissez OPENAI_API_KEY ou passez api_key au constructeur")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = model
        self.conversation_history = []
    
    def set_system_prompt(self, prompt):
        """Définit le prompt système qui contrôle le comportement du chatbot"""
        self.conversation_history = [
            {"role": "system", "content": prompt}
        ]
    
    def chat(self, user_message):
        """
        Envoie un message au chatbot et retourne la réponse
        
        Args:
            user_message: Message de l'utilisateur
            
        Returns:
            Réponse du chatbot
        """
        # Ajoute le message de l'utilisateur à l'historique
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        try:
            # Appel à l'API ChatGPT
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.conversation_history,
                temperature=0.7,  # Contrôle la créativité (0-2)
                max_tokens=1000,  # Longueur maximale de la réponse
            )
            
            # Récupère la réponse
            assistant_message = response.choices[0].message.content
            
            # Ajoute la réponse à l'historique
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
            
        except Exception as e:
            return f"Erreur lors de l'appel à l'API: {str(e)}"
    
    def reset_conversation(self):
        """Réinitialise l'historique de conversation"""
        system_messages = [msg for msg in self.conversation_history if msg["role"] == "system"]
        self.conversation_history = system_messages
    
    def get_conversation_history(self):
        """Retourne l'historique complet de la conversation"""
        return self.conversation_history


def main():
    """Fonction principale pour tester le chatbot en mode interactif"""
    print("=== ChatBot GPT ===")
    print("Tapez 'quit' ou 'exit' pour quitter")
    print("Tapez 'reset' pour réinitialiser la conversation")
    print("=" * 50)
    
    # Initialise le chatbot
    try:
        bot = ChatBot(model="gpt-4o-mini")  # Modèle économique et rapide
        
        # Définit un prompt système optionnel
        bot.set_system_prompt(
            "Tu es un assistant utile et amical. "
            "Réponds de manière concise et claire en français."
        )
        
        print("\nChatbot prêt! Posez votre question:\n")
        
        # Boucle de conversation
        while True:
            user_input = input("Vous: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Au revoir!")
                break
            
            if user_input.lower() == 'reset':
                bot.reset_conversation()
                print("Conversation réinitialisée.\n")
                continue
            
            # Obtient et affiche la réponse
            response = bot.chat(user_input)
            print(f"\nBot: {response}\n")
    
    except ValueError as e:
        print(f"Erreur: {e}")
        print("\nPour utiliser ce script, définissez votre clé API:")
        print("export OPENAI_API_KEY='votre-clé-api'")
    except Exception as e:
        print(f"Erreur inattendue: {e}")


if __name__ == "__main__":
    main()