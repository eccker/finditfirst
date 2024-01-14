# Find It First

This is base repository for Find It First Gamee. It is a real-time interactive multi-peer communication system. It uses socket.io, p5.js, jwt and many other technologies to quickly build on top of it. 

This repository is optimized to run in conjunction with Cloud Build and Cloud Run from Google Cloud Platform for deploying. It uses a docker conteiner to run the app.

Find it First is a game that presents twelve images to the player divided on two decks, top and botton. Images displayed are randomly choosen from unsplash. The game requires user to find an image from botton deck and drag it to a match image on the top deck. If no match are found on presented images, player can shuffle both decks until at least one match appears on display. Player has a limited amount of time to find a match. If not match found and time expires, the player loses a ticket. Player can have more than one tickets.

At first it is easy to find a match as the number of random images from which displayed images are selected is 8 and increments one image per try up to a limit of 1900 images.

The amount of time the player has to find a match is random too ranging from 12 seconds up to 76 seconds.

That is the basic game.

There are several modalities of playing this game

**Solo  (anyone can play solo without money)
High Score (players pay a fixed price to compete to achieve the highest score, player can win accumulated reward collected from other players if surpases the last high score)
1 vs 1 (player bets against other player, players define bet price)
Multiplayer (player bets against multiple players, fixed bet price)
Tournament (player subscribe to a tournament and plays until is eliminated by other player or wins the tournament, fixed price)
Tour (player subscribe to a tour, has to play several tournaments, fixed price & player has to pay for each tournament with discount if pay in advance)

every reward redeem/reclaim transaction has a 8.2% fee to withdraw

// TODO:
-Decide on a "Pause Button"
Design the UX and UI for "Find it First":

### 1. **Homepage:**
   - Solo can be played without login and without pay
   - Provide a login page for player to login and/or connect his wallet
   - High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes only can be played if login and wallet connected
   - Player have to pay with FIFs the entrancy fee (fixed for High Score, Multiplayer/variable for Tournament, and Tour modes) 
   - Provide clear navigation options for Solo, High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes.
   - Display the player's profile
   - Include a settings option for sound, graphics, and other preferences.
   - Feature an attractive and dynamic background related to the game theme.

### 2. **player's profile**
   - username, 
   - avatar, 
   - tickets, 
   - max level achieved, 
   - FIF level (based on number of games played, speed, high-score wins, 1vs1 wins, multiplayer wins, Tournament wins and Tour wins). A win is valid only if voucher is redeemed 
   - in-game erc20 token balance.
### 3. **Game Mechanics:**
   - Players must buy/mint FIF ERC20 tokens
   - Players must buy FIF tickets with FIF ERC20 tokens (1 ticket equals 1 token)
   - A ticket can be hold, spent in-game but no withdraw or transfer.
   - Winner player receive (Tickets Won)*91%
   - There are Solo, High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes
   - Solo game do not require FIF tickets
   - Solo game came with 3 free tickets
   - Solo game can be customized in difficulty and expiring try time (only with login)
   - Players can not spend tickets in Solo games and no reward is emitted 
   
   - A try is when player have to drag and drop an image from bottom deck to a matching image in top deck before time expires.
   - If no matches are found in the two decks and there is time left in the expiring timer, player can swift decks to get randomly selected images from the bank of images at current try.
   - If time expires and player do not found a match a ticket is spent.
   - Player can play another try of the same game if has at least one ticket.
   - If player found a match before time expires the player can play another try with more difficulty and without spending tickets
   - Difficulty refers to a bank of N images used to generate decks in one try. For example, difficulty=8 means eight images are used to randomly build two decks of twelve images in total so probably several repeated images are shown in decks to player in the same try so is easy to spot a match. A difficulty=100 means a bank of 100 images is used to randomly build the two decks with twelve images in total so probably the player has to swift decks several times to find a match.
   - A game is a series of continuous tries played until lose or win.
   - If all player's tickets are spent, player loses the game in all modes
   
   - In High Score mode Reward is the accumulation of tickets spent from players
   - In High Score mode player have to has at least one ticket to play
   - In High Score mode player can spend as many tickets as player has in the same game
   
   - In 1 vs 1 mode players can bet a custom amount of tickets
   - In 1 vs 1 mode players must bet the equal amount of tickets
   - In 1 vs 1 mode Player A can open a new game an waits for a player B to join
   - In 1 vs 1 mode Player A sets bet amount
   - In 1 vs 1 mode Player B can look for and join games with desired bet amount
   - In 1 vs 1 mode both players press a ready button and after a short timer the game starts 
   - In 1 vs 1 mode both players receive the same random images, same random decks and same random expiring time per try
   - In 1 vs 1 mode a record of images used, expiring time, difficulty, time to match and image matched are generated per try




   - Players start playing acording to:
        solo: whenever the player start the game
        high-score: whenever the player start the game
        1vs1: Both players must hit a ready button and after a short timer the game starts.  
        multiplayer: Onces the group is full the game starts after a short timer.
     
   - 1 vs 1 mode is time limited, players can set the time
   - 
### 2. **Game Interface:**
   - Split the screen into two decks (top and bottom) for the images.
   - Clearly display the player's tickets, time remaining, and current level.
   - Include a shuffle button for both decks.
   - Design how playera can drag and drop images from the bottom deck to match with the top deck.
   - Use vibrant and contrasting colors for easy visibility.
   - Provide visual and auditory cues for correct and incorrect matches.
   - Include a timer that counts down the remaining time.
   - Clearly communicate the increasing difficulty as more images are added.
   - Use visual indicators for the number of images added per level.
   - Create a modal or separate screens for each game mode.
   - Clearly explain the rules and objectives for each mode.
   - Include a section for players to manage their ERC20 token balance.
   - Integrate a secure and user-friendly ERC20 token payment system.
   - Clearly outline the costs associated with each game mode and any potential rewards.
   - Provide an option for players to view their transaction history.

### 3. **Winning mechanincs:**
   - A player wins in High Score mode when surpases the last high score. 
   - A player loses in High Score mode when spent all tickets.

   - A Player wins 1 vs 1 mode when player got higher score than opponent preserving at least one ticket. 
   - A Player loses in 1 vs 1 mode when spent all tickets. Opponent wins the game no matter the score.
   
   - A player wins in Multiplayer mode when player got the highest score on the game preserving at least one ticket.
   - A player wins in Multiplayer mode when player is the last one playing with at least one ticket no matter the score. 
   
   - A player wins in Tournament mode when player advances on group stages, elimination rounds and wins the final game in the tournament. Each game is evaluated as in 1 vs 1 mode.
   
   - Tour 
   
### 3. **Solo Mode:**
   - Allow players to start a solo game easily from the homepage.
   - Display the player's high score for motivation.
   - Include a "Play Again" option after completing a solo game.

### 6. **High Score:**
   - Display the current high score prominently on page.
   - Implement a leaderboard that showcases top players in each game mode.
   - Allow players to view their own ranking and achievements.

### 4. **1 vs 1 Mode:**
   - Allow players to invite friends or match with random opponents.
   - Clearly display the bet amount and potential winnings.
   - Incorporate a chat feature for interaction between players.
   - Include a rematch option after a match ends.

### 5. **Multiplayer Mode:**
   - Display a list of available games or create a lobby for players to join.
   - Clearly state the fixed bet price for participation.
   - Provide a leaderboard to showcase top players.

### 6. **Tournament Mode:**
   - Allow players to subscribe to tournaments with fixed prices.
   - Display the tournament bracket and progress.
   - Include rewards for tournament winners.

### 7. **Tour Mode:**
   - Allow players to subscribe to tours with fixed prices.
   - Clearly outline the structure and schedule of the tour.
   - Offer discounts for advanced payment.

### 8. **In-App Purchases:**
   - Include an in-app store for purchasing additional tickets, time boosts, or power-ups.
   - Clearly display the pricing and benefits of each purchase.

### 9. **Notifications and Rewards:**
   - Send notifications for upcoming tournaments, tours, or events.
   - Reward players with in-game currency, power-ups, or customization options for achieving milestones.

### 10. **Feedback and Help:**
   - Provide feedback on successful matches, high scores, and achievements.
   - Include a help section or tutorial for new players.

### 11. **Visual and Sound Effects:**
   - Use appealing visuals and animations to make the game engaging.
   - Implement sound effects that enhance the gaming experience.

### 12. **Testing:**
   - Conduct usability testing to ensure the interface is intuitive.
   - Gather player feedback and make iterative improvements.




