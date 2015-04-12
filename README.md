# black-hole.js #

[Demo and explanatory blog post](http://cliffcrosland.tumblr.com/post/115981256393/black-hole-js).

In the time-honored tradition of taking yet another noun and making .js file out of it, I proudly present black-hole.js, which uses a numerical ordinary differential equation solver from numeric.js, and some nice WebGL utilities from glfx.js, to render the gravitational lensing of a black hole.

![black hole image](https://s3-us-west-2.amazonaws.com/ccrosland-share-bucket/black-hole/blackhole.PNG)



Note: due to HTML5's security restrictions, you must either render images from your own domain or from a server where CORS is ok. I believe the default CORS settings for S3 buckets work fine.

Usage:
```html
<div id="canvas_placeholder"></div>
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.js"></script>
<script src="./black-hole.min.js"></script>
<script>
  var corsOkImageUrl = 'https://s3-us-west-2.amazonaws.com/ccrosland-share-bucket/black-hole/milkyway.jpg';
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

You can black-holeify your cat, too:

![black hole cat](https://s3-us-west-2.amazonaws.com/ccrosland-share-bucket/black-hole/cat-black-hole.PNG)
