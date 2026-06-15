# Activer les liens YouTube (cookies)

YouTube bloque les téléchargements depuis les serveurs cloud. Pour que les
**liens YouTube** fonctionnent en ligne, on fournit à Bob des cookies d'un
compte YouTube connecté — il passe alors le contrôle anti-robot.

> ⚠️ À savoir avant de commencer :
> - Utilise de préférence un **compte Google secondaire / jetable**, pas ton
>   compte principal (c'est contre les conditions de YouTube, le compte pourrait
>   être signalé).
> - Les cookies **expirent** (quelques jours à quelques semaines). Quand les
>   liens recommenceront à échouer, il faudra **ré-exporter** des cookies frais.
> - L'**import de fichier** reste la méthode la plus simple et sans entretien.

## 1. Exporter les cookies

1. Dans Chrome/Brave, installe l'extension **« Get cookies.txt LOCALLY »**
   (depuis le Chrome Web Store).
2. Ouvre **https://www.youtube.com** et **connecte-toi** (compte secondaire).
3. Clique sur l'icône de l'extension → **Export** (format **Netscape**).
4. Tu obtiens un fichier `cookies.txt`. Ouvre-le, **copie tout son contenu**.

## 2. Mettre les cookies sur Render

1. Render → service **`bob-io`** → onglet **Environment**
2. **Add Environment Variable** :
   - **Key** : `BOB_YT_COOKIES`
   - **Value** : colle tout le contenu du `cookies.txt`
3. **Save Changes** → Render redéploie (~3 min)

> Si le collage multi-lignes pose problème, encode le fichier en base64 et colle
> le résultat (Bob détecte et décode automatiquement le base64).

## 3. Tester

Une fois **Live**, va dans l'atelier, colle un lien YouTube et lance.
Si ça échoue encore avec un message « cookies expirés », ré-exporte des cookies
récents (étape 1) et remplace la valeur sur Render.
