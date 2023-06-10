<template>
  <footer>
    <div class="bottomDiv">
      <p class="white">Twitter</p>
    </div>

    <div class="bottomCorner"></div>
  </footer>
</template>

<style scoped>
footer {
  position: relative;
  width: 100%;
}

.bottomDiv {
  background-color: black;
  padding: 20px 50px;
  position: relative;
}

.bottomCorner {
  box-sizing: content-box;
  border-bottom: 80px solid black;
  border-left: 100px solid transparent;
  width: 125px;
  height: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: -1;
}

@media only screen and (max-width: 550px) {
  .bottomDiv {
    padding: 15px 20px;
  }

  .bottomCorner {
    border-left: 50px solid transparent;
    border-bottom: 70px solid black;
  }
}
</style>
