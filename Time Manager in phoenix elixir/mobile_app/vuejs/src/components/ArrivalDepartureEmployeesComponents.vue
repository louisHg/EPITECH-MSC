<template>
    <div class="arrDep">
        <h2 class="title">Arrival</h2>
        <input id="arrival" type="datetime-local" placeholder="Arrival" required autofocus />
        <h2 class="title">Departure</h2>
        <input id="departure" type="datetime-local" placeholder="Departure" required autofocus />
        <button class="save">SAVE</button>
    </div>
</template>

<script>

</script>

<style>
.arrDep {
    padding: 5px;
    margin: 0 auto;
    width: 25%;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: f4f4f4;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25), 10px 0 20px rgba(0, 0, 0, 0.25);
}

.arrDep .title {
    font-weight: 500;
    margin-bottom: 5px;
}

.arrDep input {
    background: transparent;
    border-bottom: 2px solid #21c3f8;
    border-radius: 0;
    padding: 0px;
}

.arrDep .save {
    border-radius: 25px;
    background: linear-gradient(269.24deg, #24c9ff, #15aad9);
    box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
    font-weight: 500;
    text-align: center;
}
</style>
