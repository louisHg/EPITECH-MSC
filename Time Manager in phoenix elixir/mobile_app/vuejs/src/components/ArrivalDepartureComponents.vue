<template>
    <div class="arrDep">
        <h2 class="title">Arrival / Departure</h2>
        <p>Tu es arrivé à : XX:XX le XX/XX/XXXX</p>
        <p>Tu es parti à : XX:XX le XX/XX/XXXX</p>
        <div class="btn-wt">
            <button class="save">ARRIVAL</button>
            <button class="save">DEPARTURE</button>
        </div>
        
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
    text-align: center;
}

.arrDep .btn-wt {
    display: flex;
}

.arrDep .save {
    border-radius: 25px;
    width: 40%;
    background: linear-gradient(269.24deg, #24c9ff, #15aad9);
    box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
    font-weight: 500;
    text-align: center;
}
</style>
