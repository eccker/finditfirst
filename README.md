# Find It First

Find it First is a game that presents twelve images to the player divided on two decks, top and botton. Images displayed are randomly choosen from unsplash. The game requires user to find an image from botton deck and drag it to a match image on the top deck. If no match are found on presented images, player can shuffle both decks until at least one match appears on display. Player has a limited amount of time to find a match. If not match found and time expires, the player loses a life. Player can have more than one life.

At first it is easy to find a match as the number of random images from which displayed images are selected is 8 and increments one image per try up to a limit of 1900 images.

The amount of time the player has to find a match is random too, ranging from 12 seconds up to 76 seconds.

The game features a multi token structure to handle regular token transactions, in-game operations, investment and governance. 

There are several modalities of playing this game

**Solo**  (anyone can play solo without tickets)
**High Score** (players pay a fixed price of tickets to compete to achieve the highest score, player can win accumulated reward collected from other players if surpases the last high score)
**1 vs 1** (player bets against another player in a room, room creator defines bet price)
**Multiplayer** (player bets against multiple players in a room, room creator defines bet price)
**Tournament** (player subscribe to a tournament and plays in a 1 vs 1 style until is eliminated by other player or wins the tournament, tournament creator defines price) 
**Tour** (player subscribe to a tour, has to play several tournaments, price defined by tour creator & player has to pay for each game match)

every reward redeem/reclaim/withdraw transaction has a 8.2% fee

# I - Game and Blockchain Tokenomics Specifications
   ## 1. **Game Mechanics:**
      - Players must buy/mint/own FIF ERC20 tokens 
      - Players must buy FIF tickets with FIF ERC20 tokens (1 ticket equals 1 token)
      - FIF tickets are special ERC20 tokens aimed to internal in-game tokenomics handling
      - A ticket can be hold and spent in-game but no withdraw or transfer.
      - Tickets only can be transfered from DAO funds account to any desired account by DAO voting (for promotions and events)
      - Winner player receive (Tickets Won)*91% in FIF ERC20 Tokens
      
      - A ticket represents 3 lifes in a game match 
      - A life refers to the continued tries performed by player finding an image match per try until player is not able to find an image match before expiring timer expires. 
      - A try is when player have to drag and drop an image from bottom deck to a matching image in top deck before time expires.
      - If no matches are found in the two decks and there is time left in the expiring timer, player can swift decks to get randomly selected images from the bank of images at current try.
      - If time expires and player do not found a match a life is spent.
      - Player can play another try of the same game if has at least one life.
      - If player found a match before time expires the player can play another try with more difficulty and without spending lifes
      - Difficulty refers to a bank of N images used to generate decks in one try. For example, difficulty=8 means eight images are used to randomly build two decks of twelve images in total so probably several repeated images are shown in decks to player in the same try so is easy to spot a match. A difficulty=100 means a bank of 100 images is used to randomly build the two decks with twelve images in total so probably the player has to swift decks several times to find a match.
      - A game match is a series of continuous tries played until lose or win.
      - If all player's lifes are spent, player loses the game match in all modes
      
      - Score per try is: 1000 * difficulty + 100 * (1/time-to-match) - 10 * Number-of-swifts 

      - There are Solo, High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes
      - High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes only can be played if login and wallet connected

      - In any mode player can quit playing in order to avoid spendign more lifes and tickets having at least one life.
      - If player quits playing, his score will remain for determining the winner in the modality played. So he could still win
   
      - Solo Mode can be played without login and without pay
      - Solo Mode do not require FIF tickets
      - Solo Mode came with 3 free lifes
      - Solo Mode can be customized in difficulty and expiring try time (only with login)
      - Solo mode Players can not spend tickets and no reward is emitted 
      
      - In High Score mode The Reward is the accumulation of tickets spent from players who do not aquieve the last high score in their game matches
      - In High Score mode player have to spend at least one ticket (3 lifes) to play
      - In High Score mode player can spend as many tickets as player has assigned to spend in the game match
         
      - In 1 vs 1 mode players can bet a custom amount of tickets
      - In 1 vs 1 mode players must bet the equal amount of tickets
      - In 1 vs 1 mode Player A sets bet amount of tickets
      - In 1 vs 1 mode is time limited, players can set the time
      - In 1 vs 1 mode Player A sets max time to start game, the game match's duration and time after winner can reclaim his reward
      - In 1 vs 1 mode if no player B join before max time to start, tickets are return to Player A minus operation fees
      - In 1 vs 1 mode max time to start is equal to the time after winner can reclaim his reward.
      - In 1 vs 1 mode Player A pays bet amount of tickets to open a new game room and waits for a player B to pay the same amount of tickets to join the game room
      - In 1 vs 1 mode Player B can look for and join game rooms with desired bet amount of tickets
      - In 1 vs 1 mode both players have to pay the same amount of tickets to play.
      - In 1 vs 1 mode both players press a ready button and after a short timer the game starts 
      - In 1 vs 1 mode both players receive the same image's sequence, same decks and same expiring time per try
      - In 1 vs 1 mode a record of images used, expiring time, difficulty, time to match, number of shuffles and image matched is stored per try

      - In multiplayer mode Player 1 sets the number of participants
      - In multiplayer mode Player 1 sets the max time to start and time after winner can reclaim this reward
      - In multiplayer mode Player 1 pays a desired amount of tickets to bet and waits to other players to pay the same amount of tickets to join
      - In multiplayer mode Players can look for and join games with desired amount of tickets to bet
      - In multiplayer mode when the number of participants is fulfill a short timer starts then game starts
      - In multiplayer all players receive the same random images, same random decks and same random expiring time per try

      - In Tournament mode player subscribe to a tournament and plays in a 1 vs 1 style until is eliminated by other player or wins the tournament
      - In Tournament mode player must pay for each game match player plays, player has to pay two game match in advance so if player fail to start the game match player loses and opponent wins. 
      - In Tournament mode tournament creator defines price for each game match 
      - In Tournament mode tournament creator defines time start, max time between game matches, max time per game match 
      
      - In Tour mode tour's creator defines number of tournaments in the tour
      - In Tour mode tour's creator defines prices and times
      - In Tour Mode player subscribe to a tour, has to play several tournaments at a fixed price per game match & player has to pay two game matches in advance
      
      - Players start playing acording to:
         solo: whenever the player start the game
         high-score: whenever the player start the game
         1vs1: Both players must hit a ready button and after a short timer the game starts.  
         multiplayer: Onces the group is full the game starts after a short timer.
   ## 2. **Winning mechanincs:**
      - A player wins in High Score mode if surpases the last high score. 
      - Players in High Score mode can still playing even if they surpased the last high score until their last life.
      - A player loses in High Score mode when spent all tickets and all lifes and got a score below the last high score.
      - A Player wins 1 vs 1 mode when player got higher score than opponent preserving at least one life after the game match's duration. 
      - A Player who wins in 1vs 1 mode does not spend a life. Winner can not reuse the tickets and lifes left for other game matches.
      - A Player loses in 1 vs 1 mode when spent all tickets. Opponent wins the game no matter the score.
      - A player wins in Multiplayer mode when player got the highest score on the game preserving at least one ticket.
      - A player wins in Multiplayer mode when player is the last one playing with at least one ticket no matter the score. 
      - A player wins in Multiplayer mode when player has the highest score and him and all other players lose the game match by spending all lifes. 
      - A player wins in Tournament mode when player advances on group stages, elimination rounds and wins the final game in the tournament. Each game is evaluated as in 1 vs 1 mode.   
      - A player wins a Tour when achieving the highest score amoung all tour participants
   ## 3. **Shareholder & players tokenomics**
      0. **Introduction**
         - There are FIF Tokens, FIF Tickets, FIF ShareCoins and FIF Winner's ShareCoins.
         - There is a FIF DAO Treasury, that holds profits coming from fees to winner's rewards withdraw
         - There is a FIF DAO Fund, that holds profits coming from fees to winner's rewards withdraw
         - Tokens are used as a general ERC20 Token over the blockchain
         - Tickets represents chances to play a match, as lifes in videogames
         - Tickets are only in-game controled/managed
         - ShareCoins are ERC721 NFTs with increasing mint price, they represent owner ship over profits provided by FIF DAO Treasury
         - Winner's ShareCoin are ERC1155 NFTs minted to winners
         - Only one Winner's ShareCoin ERC1155 NFT is minted per address
         - Winner's ShareCoin is a dynamic NFT that evolves according to winner's victories & scores
         - FIF DAO Treasury is owned by ShareCoin holders
         - FIF DAO Fund is govern by Winner's ShareCoin holders
         - 
      1. **FIF ERC20 Token**
         - This is the base token for the whole tokenomic architecture
         - FIF ERC20 Token (or simply FIF Token) is a compliant ERC20Permit token (712)
         - Any user can buy or mint FIF Tokens
         - FIF Token is a stable coin
         - FIF Token has a withdraw fee: 8.2%
         - FIF Token is pretty much as any ERC20 Token like USDC, USDT, DAI, etc...
         - FIF Tokens is the only token accepted to buy FIF Tickets
         - Players are paid with FIF Tokens
         - One FIF Token equals One FIF Ticket
      2. **FIF ERC20 Ticket**
         - FIF ERC20 Tickets (or simply FIF Tickets) only can be bought with FIF Tokens
         - A FIF Ticket represents 3 lifes in a FIF Game
         - FIF Tickets once bought only can be spent but not withdraw nor trasfer them
         - Only FIF DAO Fund can transfer FIF Tickets from its fund to any desired account that Winner ShareCoin holders vote to (for promotions and events)
         - Players bet with FIF Tickets but they get reward directly in FIF Tokens
         - One FIF Ticket equals One FIF Token
         - FIF Tickets are mainly consumed/burn by FIF contract (main game contract)
      3. **FIF winners rewards and fees transactions**
         - FIF winners receive a reward according to the modality they play
         - FIF rewards are counted in FIF Tickets but converted 1 to 1 to FIF Tokens when withdraw
         - FIF rewards (in FIF Tokens) are split among winner 91.8%, author 2%, DAO treasury 4.2% and DAO fund 2% 
         - Solo mode has no reward 
         - In High Score mode, player wins if him surpases the latest high score
         - In High Score mode, player receive the acumulated tickets spent by other players who do not surpace the last high score
         - In 1 vs 1 mode, player win if is the last one playing and has at least one life remaining
         - In 1 vs 1 mode, player loses if spent all his lifes in a game match
         - In 1 vs 1 mode, player win if he has the high score in the game match and has at least one life
         - In 1 vs 1 mode, if both players spent all their lifes in a game match before the game match time expires, highest score wins.
         - In multiplayer mode highest score wins with at least one life remaining
         - in multiplayer mode if all players spent their lifes, highest scores wins
         - In tournament mode, a player win if he wins all game matches
         - In Tour mode, a player win a tour if he has the highest accumulated score among all tournaments
      4. **FIF ERC20 ShareCoin**
         - FIF ShareCoin is a ERC20 token aimed to be a investment tool to invest in FIF
         - FIF ShareCoin can be transfered/traded as any usual ERC20 token
         - FIF ShareCoin has a limited supplied
         - FIF ShareCoin has an incremental price
         - FIF ShareCoin holders have access to profits coming from FIF DAO Treasury
      5. **FIF ERC20 Winners ShareCoin**
         - FIF winners receibe Winners Share Coins when they reclaim their rewards
         - FIF Winners sharecoins are untransferable nor unswapable so they will always be attached to the winners wallet
         - FIF Winners ShareCoin allow winners to take part into the DAO fund for voting and proposing
      6. **FIF DAO Treasury: Own by FIF ShareCoin holders**
         - FIF DAO Treasury receive income from winners rewards in the form of FIF Tokens
         - FIF DAO Treasury distribute earning among FIF ShareCoin holders
         
      7. **FIF DAO Fund: Govern by Winners ShareCoin holders**
         - FIF DAO Fund receive income from winners rewards in the form of FIF Tokens
         - FIF DAO Fund funds can be distributed to anyone by FIF Winners ShareCoin voting.
         - FIF DAO Fund aims to research and develop around the game
         - FIF DAO Fund aims to fund projects benefical to humanity 
   ## 4. **Roadmap:**
      1. **Early demos and prototypes**
         - Done
      2. **Solo Mode Implementation**
         - Done
      3. **FIF ERC20 Token Implementation**
         - WIP, alpha
      4. **FIF ERC20 Ticket Implementation**
         - WIP, alpha
      5. **FIF ERC20 ShareCoin Implementation**
         - WIP, alpha
      6. **FIF DAO Treasury Implementation**
         - WIP, initial draft
      7. **FIF DAO Fund Implementation**
         - WIP, initial draft 
      8. **FIF ERC20 ShareCoin Implementation**
         - WIP, alpha
      9. **High Score Implementation**
      10. **1 vs 1 Implementation**
      11. **Multiplayer Implementation**
      12. **Tournament Implementation**
      13. **Tour Implementation**
      14. **Audit process, resolve issues**
      15. **Test launch to testnet and invite beta players**
      16. **Security Hackathon v.0.0.1**
      17. **Production deployment**
      18. **Shareholder returns**
      19. **Security Hackathon v.1.0.0**
      20. **Continues monitoring, improvements and deyploments**

# II - Design and Web/Web3 Requirements
   ## 1. **Homepage:**
      - Provide a login modal for player to login 
      - Provide a connect wallet modal for player to connect his wallet
      - Provide a quick access button to play in Solo mode
      - Provide clear navigation options for Solo, High Score, 1 vs 1, Multiplayer, Tournament, and Tour modes.
      - Provide a player's profile modal
      - Include a settings modal for sound, graphics, and other preferences.
      - Feature an attractive and dynamic background related to the game theme.
   ## 2. **Player's Profile**
      - username, 
      - avatar, 
      - tickets,
      - tokens,
      - max level achieved, 
      - best time to match time
      - FIF level (based on number of games played, speed, high-score wins, 1 vs 1 wins, multiplayer wins, Tournament wins and Tour wins).
      - in-game erc20 token balance.
   ## 3. **Game Interface:**
      - Split the screen into two decks (top and bottom) for the images.
      - Clearly display the player's remaining lifes, tickets, tokens, time remaining, and current level.
      - Include a shuffle button for both decks.
      - Design how playera can drag and drop images from the bottom deck to match with the top deck.
      - Use vibrant and contrasting colors for easy visibility.
      - Include visual of communication for authors, descriptions, image title, unsplash link, etc.
      - Provide visual and auditory cues for correct and incorrect matches.
      - Include a timer that counts down the remaining time.
      - Clearly communicate the increasing difficulty as more images are added.
      - Use visual indicators for the number of images added per level.
      - Create a modal or separate screens for each game mode.
      - Clearly explain the rules and objectives for each mode.
      - Include a section for players to manage their ERC20 token and ticket balance.
      - Integrate a secure and user-friendly ERC20 token payment system.
      - Clearly outline the costs associated with each game mode and any potential rewards.
      - Provide an option for players to view their transaction history.
   ## 4. **Other features:**
      1. **Solo Mode:**
         - Allow players to start a solo game easily from the homepage.
         - Display the player's high score for motivation.
         - Include a "Play Again" option after completing a solo game.

      2. **High Score:**
         - Display the current high score prominently on page.
         - Implement a leaderboard that showcases top players in each game mode.
         - Allow players to view their own ranking and achievements.

      3. **1 vs 1 Mode:**
         - Allow players to invite friends or match with random opponents.
         - Clearly display the bet amount and potential winnings.
         - Incorporate a chat feature for interaction between players.
         - Include a rematch option after a match ends.

      4. **Multiplayer Mode:**
         - Display a list of available games or create a lobby for players to join.
         - Clearly state the fixed bet price for participation.
         - Provide a leaderboard to showcase top players.

      5. **Tournament Mode:**
         - Allow players to subscribe to tournaments with fixed prices.
         - Display the tournament bracket and progress.
         - Include rewards for tournament winners.

      6. **Tour Mode:**
         - Allow players to subscribe to tours with fixed prices.
         - Clearly outline the structure and schedule of the tour.
         - Offer discounts for advanced payment.

      7. **In-App Purchases:**
         - Include an in-app store for purchasing additional tickets, time boosts, or power-ups.
         - Clearly display the pricing and benefits of each purchase.

      8. **Notifications and Rewards:**
         - Send notifications for upcoming tournaments, tours, or events.
         - Reward players with in-game currency, power-ups, or customization options for achieving milestones.

      9. **Feedback and Help:**
         - Provide feedback on successful matches, high scores, and achievements.
         - Include a help section or tutorial for new players.

      10. **Visual and Sound Effects:**
         - Use appealing visuals and animations to make the game engaging.
         - Implement sound effects that enhance the gaming experience.

      11. **Testing:**
         - Conduct usability testing to ensure the interface is intuitive.
         - Gather player feedback and make iterative improvements.

