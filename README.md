# black-hole.js #

In the time-honored tradition of taking yet another noun and making .js file out of it, I proudly present black-hole.js, which uses a numerical ordinary differential equation solver from numeric.js, and some nice WebGL utilities from glfx.js, to render the gravitational lensing of a black hole.

![black hole image](https://s3-us-west-2.amazonaws.com/ccrosland-share-bucket/black-hole/blackhole.PNG)

For an explanation of how it works, see [the blog post](http://cliffcrosland.tumblr.com/post/115981256393/black-hole-js).

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
    distanceFromBlackHole: 20, // 30 is default
    numAngleTableEntries: 150, // 100 is default, more might improve quality but impact performance
    fovAngleInDegrees: 60, // 80 is default
  });
</script>
```
