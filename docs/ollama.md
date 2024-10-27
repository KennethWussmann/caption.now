# Using Ollama

caption.now can use Ollama to add AI-powered captioning and suggestions.

## Installing Ollama

Please refer to Ollama's website for up-to-date instructions: https://ollama.com/
But it's very simple, download, install and run and you should be good to go.

## Configuring Ollama in caption.now

1. Go to the settings in caption.now
2. Select the "AI" tab
3. Enable Ollama
4. Enter the URL of your Ollama server. Default `http://127.0.0.1:11434`

## FAQ

### Do I need a server for Ollama?

No, you can just run Ollama on your local computer. However, if you don't have a graphics card, the AI features may load longer.

### Error on caption.now saying something about browser security policies?

Yes, if you use caption.now via [https://caption.now](https://caption.now), you may encounter problems when using Ollama.

This problem occurs if you use [https://caption.now](https://caption.now) and your Ollama instance is not running on `localhost` or `127.0.0.1` or is not using HTTPS. 

Potential fixes:
- Run caption.now locally on your machine. See the running guide: 
- Run Ollama on the same computer where you use [https://caption.now](https://caption.now). Then the Ollama URL would be `http://127.0.0.1:11434` which does not cause trouble.
- Run Ollama behind HTTPS. This is a more involved process, that I cannot provide good instructions for. But if you know how to do it, thats probably the best.

