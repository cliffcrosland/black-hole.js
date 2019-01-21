# black-hole.js #

[Demo and explanatory blog post](https://cliffcrosland.com/posts/black-hole-js/).

~[milky-way-with-black-hole](https://s3-us-west-1.amazonaws.com/cliffcrosland-public/black_hole_js/milky_way_with_black_hole.png)

In the time-honored tradition of taking yet another noun and making .js file out of it, I proudly present black-hole.js, which uses a numerical ordinary differential equation solver from numeric.js, and some nice WebGL utilities from glfx.js, to render the gravitational lensing of a black hole.

Note: due to HTML5's security restrictions, you must either render images from your own domain or from a server where CORS is ok.

Usage:
```html
<div id="canvas_placeholder"></div>
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.js"></script>
<script src="./black-hole.min.js"></script>
<script>
  var corsOkImageUrl = 'https://s3-us-west-1.amazonaws.com/cliffcrosland-public/black_hole_js/milky_way.jpg';
  BlackHole.blackHoleifyImage('canvas_placeholder', corsOkImageUrl)
</script>
```

You can also specify some parameters to change the gravitational lensing effect:
```html
<script>
  BlackHole.blackHoleifyImage(placeholderId, corsOkImageUrl, {
    distanceFromBlackHole: 70, // 80 is default
    polynomialDegree: 3, // 2 is default
    numAngleTableEntries: 2000, // 1000 is default. More might improve quality but impact performance
    fovAngleInDegrees: 60, // 73 is default. Yeah, it's an unusual choice, but it just looked cool, ok?
  });
</script>
```
