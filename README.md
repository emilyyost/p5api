# p5api
Set Up
x Build a memory game 
x 5x4 Grid of 20 images
  x Get half num of images from giphy
  x Make sure images are placed randomly in grid 
x Start all images hidden
  x Draw filled rect instead of images

Playing Game
x When hidden image is clicked, it displays image and keeps it displayed
x When second hidden image clicked
  x if matched leave flipped over
  x else if clicks exposed image, ingore click
  else hide images after alert msg "no match"
    if all images are exposed, alert "you win", "play again?"
      if yes, redo setup
      else "thanks for playing!" 
