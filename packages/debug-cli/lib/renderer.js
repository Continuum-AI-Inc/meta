setInterval(function () {
    console.log("Hey There");
    process.stdout.write('\x1b[0f');
}, 1000);
