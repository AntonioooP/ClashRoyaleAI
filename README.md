# Clash Royale AI
## Introduction
The aim of this project is to develop an AI that is capable of playing Clash Royale effectively.

This project was inspired by consistently losing and a showcase from [Ombarus YouTube video](https://www.youtube.com/watch?v=Q4cVkUFjvCo).

I chose to implement this project solely in JavaScript, as it is the programming language I am most familiar with, and would represent a challenge.

I would like to extend special thanks to ChatGPT-4 for its invaluable support throughout the project, providing assistance from inception to completion.
## Project Status: Work in Progress (WIP)
This project is currently under active development, and as such, it is important to note that all aspects, including methodologies, strategies, and technical approaches, are subject to change based on the evolving challenges and the performance metrics of the AI. Our commitment is to adapt and refine our methods to achieve the most effective AI gameplay strategies.

## Methodology
The project addresses a variety of challenges through multiple approaches and strategies:

### Challenges:
- Identifying Opponent's Played Cards:
    - To address this, we plan to implement an object detection AI capable of identifying cards on the field by drawing bounding boxes around them. This feature will distinguish between the cards played by the opponent and those played by the player. It's noteworthy that this component is developed using a Jupyter Notebook on Google Colab for ease of use. This will be the only feature of this project made with Python.
- Determining Player's Elixir:
    - Contrary to the method demonstrated in Ombarus' video, we utilize a distinct approach for tracking the player's current elixir by cropping a screenshot to the specific area showing the elixir bar, as illustrated below:

        We then apply the Jimp library to calculate the fill percentage of the elixir bar. This is done by iterating through each column to locate the first non-filled pixel, offering a more precise measurement.
- Identifying Playable Cards:
    - This involves developing a mechanism to keep track of the cards that are currently available for the player to use, taking into account both the elixir cost and the cycling of the cards in the deck.
- Selecting the Appropriate Card to Play:
    - Strategies will be developed for deciding which card to play based on the current game state, the opponent's actions, and the cards available to the player. 
- Optimal Card Placement:
    - The AI will determine the most effective locations on the battlefield to place cards, aiming to maximize their impact and counter the opponent's strategies.
- Estimating Opponent's Elixir and Predicting Cards:
    - The AI will estimate the opponent's elixir count and anticipate their card plays by analyzing their past actions and current game dynamics. 

### Pre-AI Strategy Development
Before diving into the development of AI for card play, the project will focus on establishing a foundational strategic framework, akin to that of chess engines. This includes:
- Evaluation Function: Implementing an evaluation function to assess the current game state and determine the most advantageous moves.

- Minimax Algorithm: Incorporating a minimax algorithm to explore possible moves and their outcomes, selecting the move that maximizes the AI's advantage while minimizing the opponent's.

- Alpha-Beta Pruning: Applying alpha-beta pruning to the minimax algorithm to efficiently search the game tree by eliminating branches that do not influence the final decision, significantly improving the algorithm's performance.

### Enhancement Ideas
Beyond the basic gameplay mechanics, the project aspires to incorporate advanced features to surpass the capabilities of average Clash Royale players, such as perfect timing, accurate predictions, and the application of reinforcement learning techniques to continuously improve the AI's strategy over time.

## Conclusion
As this Clash Royale AI project progresses, we remain flexible and open to adjustments, ensuring that every step taken is in the direction of optimizing AI performance and gameplay strategy. We look forward to overcoming the challenges ahead and advancing the capabilities of AI in Clash Royale.