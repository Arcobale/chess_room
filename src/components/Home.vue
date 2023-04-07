<template>
    <div class="home">
        <router-link to="/golang"><button>五子棋</button></router-link>
        <router-link to="/othello"><button>黑白棋</button></router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
}

.home {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/background2.jpg') no-repeat center fixed;
    background-size: 100% 100%;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

button {
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 25px;
    background-color: brown;
    border-radius: 10%;
    color: white;
    cursor: pointer;
}
</style>