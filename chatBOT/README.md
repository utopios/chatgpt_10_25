# ChatBot GPT - Script Python

Un script Python simple et réutilisable pour créer un chatbot utilisant l'API OpenAI ChatGPT.

## 📋 Prérequis

- Python 3.8 ou supérieur
- Une clé API OpenAI (obtenez-la sur https://platform.openai.com/api-keys)

## 🚀 Installation

1. **Clonez ou téléchargez les fichiers**

2. **Installez les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configurez votre clé API**

Créez un fichier `.env` à partir du modèle :
```bash
cp .env.example .env
```

Éditez le fichier `.env` et ajoutez votre clé API :
```
OPENAI_API_KEY=sk-votre-clé-api-ici
```

Ou définissez la variable d'environnement directement :
```bash
export OPENAI_API_KEY='sk-votre-clé-api-ici'
```

## 💻 Utilisation

### Mode interactif (CLI)

Lancez le chatbot en mode conversation :
```bash
python chatbot_gpt.py
```

Commandes disponibles :
- Tapez votre message pour discuter
- `reset` - Réinitialise la conversation
- `quit` ou `exit` - Quitte le programme

### Utilisation dans votre code

```python
from chatbot_gpt import ChatBot

# Initialiser le chatbot
bot = ChatBot(model="gpt-4o-mini")

# Définir un prompt système (optionnel)
bot.set_system_prompt("Tu es un assistant technique en Python.")

# Envoyer un message
response = bot.chat("Comment créer une liste en Python?")
print(response)

# La conversation garde le contexte
response2 = bot.chat("Et un dictionnaire?")
print(response2)

# Réinitialiser la conversation
bot.reset_conversation()
```

### Exemples avancés

Exécutez les exemples fournis :
```bash
python exemple_usage.py
```

## 🎯 Fonctionnalités

- ✅ Conversation avec conservation du contexte
- ✅ Personnalisation du comportement via prompt système
- ✅ Gestion de l'historique des conversations
- ✅ Réinitialisation de la conversation
- ✅ Support de tous les modèles OpenAI (GPT-4, GPT-3.5, etc.)
- ✅ Gestion des erreurs
- ✅ Mode interactif en ligne de commande

## 🔧 Configuration

### Paramètres du ChatBot

```python
bot = ChatBot(
    api_key="votre-clé",  # Optionnel si défini dans .env
    model="gpt-4o-mini"   # Modèle à utiliser
)
```

### Modèles disponibles

- `gpt-4o` - Modèle le plus performant et multimodal
- `gpt-4o-mini` - Rapide et économique (recommandé)
- `gpt-4-turbo` - Équilibre performance/coût
- `gpt-3.5-turbo` - Le moins cher

### Paramètres de génération

Dans `chatbot_gpt.py`, vous pouvez ajuster :

```python
response = self.client.chat.completions.create(
    model=self.model,
    messages=self.conversation_history,
    temperature=0.7,      # Créativité (0-2) - 0: déterministe, 2: très créatif
    max_tokens=1000,      # Longueur max de la réponse
    top_p=1.0,            # Nucleus sampling (alternative à temperature)
    frequency_penalty=0,  # Pénalité de répétition (-2 à 2)
    presence_penalty=0,   # Encourage nouveaux sujets (-2 à 2)
)
```

## 📝 Exemples d'usage

### Bot de service client
```python
bot = ChatBot()
bot.set_system_prompt(
    "Tu es un agent du service client. "
    "Tu es poli et tu aides à résoudre les problèmes."
)
response = bot.chat("J'ai un problème avec ma commande")
```

### Traducteur
```python
bot = ChatBot()
bot.set_system_prompt("Tu es un traducteur professionnel.")
response = bot.chat("Traduis en anglais: Bonjour le monde")
```

### Assistant de code
```python
bot = ChatBot()
bot.set_system_prompt("Tu es un expert en Python.")
response = bot.chat("Comment lire un fichier CSV?")
```

## 💰 Coûts

Les tarifs OpenAI (au 01/01/2025) :

| Modèle | Input | Output |
|--------|-------|--------|
| GPT-4o | $2.50/1M tokens | $10.00/1M tokens |
| GPT-4o-mini | $0.15/1M tokens | $0.60/1M tokens |
| GPT-3.5-turbo | $0.50/1M tokens | $1.50/1M tokens |

💡 Astuce : Utilisez `gpt-4o-mini` pour le développement et les tests.

## ⚠️ Bonnes pratiques

1. **Ne jamais commiter votre clé API** dans un dépôt Git
2. **Limiter max_tokens** pour contrôler les coûts
3. **Implémenter un rate limiting** en production
4. **Valider les entrées utilisateur** avant de les envoyer
5. **Gérer les erreurs réseau** et les timeouts
6. **Monitorer l'utilisation** de l'API

## 🐛 Dépannage

**Erreur : "Clé API OpenAI requise"**
- Vérifiez que votre clé API est correctement définie dans `.env` ou comme variable d'environnement

**Erreur : "Rate limit exceeded"**
- Vous avez dépassé votre quota. Attendez ou passez à un plan payant

**Erreur : "Invalid API key"**
- Vérifiez que votre clé commence par `sk-` et est valide sur platform.openai.com

## 📚 Ressources

- [Documentation OpenAI](https://platform.openai.com/docs)
- [Guide des modèles](https://platform.openai.com/docs/models)
- [Tarification](https://openai.com/pricing)
- [Meilleures pratiques](https://platform.openai.com/docs/guides/production-best-practices)

## 📄 Licence

Ce code est fourni à titre d'exemple. Libre d'utilisation et de modification.