<template>
  <div class="chart" v-if="this.userWorkingTime.length > 0">
    <h3>Hours of works accumulates this 5 lasts days</h3>
    <div class="chartContainer">
      <div class="lineContainer">
        <Line
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
          class="line"
        ></Line>
      </div>
      <div class="barContainer">
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
          class="bar"
        ></Bar>
      </div>
      <div class="pieContainer">
        <Pie
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        ></Pie>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Pie, Line, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";
const axios = require("axios");
const moment = require("moment");
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LineElement,
  BarElement,
  LinearScale,
  PointElement
);

export default defineComponent({
  name: "PieChart",
  components: {
    Pie,
    Line,
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "pie-chart",
    },
    lineId: {
      type: String,
      default: "line-chart",
    },
    width: {
      type: Number,
      default: 450,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      url: null,
      firstday: null,
      lastday: null,
      hoursday: null,
      userWorkingTime: [],
      dateCharts: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Working Time",
            backgroundColor: [
              "#457b9d",
              "#a8dadc",
              "#e63946",
              "#f0ffa1",
              "#ff9e6e",
            ],
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: false,
      },
    };
  },
  methods: {
    getCurrentWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first - 6; // last day is the first day + 6
      const firstdayDotErased = new Date(curr.setDate(first+2))
        .toISOString()
        .split(".")[0];
      const lastdayDotErased = new Date(curr.setDate(last))
        .toISOString()
        .split(".")[0];

      this.lastday = firstdayDotErased.split("T").join(" ");
      this.firstday = lastdayDotErased.split("T").join(" ");
      this.hoursday = firstdayDotErased.split("T")[1];
    },
    setDayOfWork() {
      var currDate = moment(this.firstday).startOf("day");
      var lastDate = moment(this.lastday).startOf("day");

      while (currDate.add(1, "days").diff(lastDate) < 0) {
        const dayNotFilter = new Date(currDate).toISOString().split(".")[0];
        const dayFilter = dayNotFilter.split("T")[0];
        this.chartData.labels.push(dayFilter);

        const day = dayFilter + " " + this.hoursday;
        this.dateCharts.push(day);
      }
    },
    async searchAllWorkingTimeForUser() {
      const sessionObject = JSON.parse(sessionStorage.getItem("sessionObject"));
      const user_id = sessionObject.SessionData.user_id;
      console.log(this.firstday);
      console.log(this.lastday);
      const searchUserWorkingTime =
        "api/workingtimes/" +
        user_id +
        "?start=" +
        this.firstday +
        "&end=" +
        this.lastday;
      await axios
        .get(this.url + searchUserWorkingTime)
        .then(
          (response) => (
            (this.userWorkingTime = response.data), this.searchUserPresence()
          )
        )
        .catch((error) => console.log(error));
    },
    async searchUserPresence() {
      const sessionObject = JSON.parse(sessionStorage.getItem("sessionObject"));
      const user_id = sessionObject.SessionData.user_id;
      const total_worked = [];
      if (this.userWorkingTime.length > 0) {
        this.setDayOfWork();
        //  replace this.lastday by this.dateCharts[1] -> because of no return 0 hours in back if not work 1 day -> 500 error
        //  Optimize this with loop when 500 occur resolve
        const searchUserWorkingTime1 =
          "api/stats/user/" +
          user_id +
          "?startDate=" +
          this.dateCharts[0] +
          "&endDate=" +
          this.dateCharts[1];
        await axios
          .get(this.url + searchUserWorkingTime1)
          .then((response) => total_worked.push(response.data.total_worked))
          .catch((error) => console.log(error));

        const searchUserWorkingTime2 =
          "api/stats/user/" +
          user_id +
          "?startDate=" +
          this.dateCharts[1] +
          "&endDate=" +
          this.dateCharts[2];
        await axios
          .get(this.url + searchUserWorkingTime2)
          .then((response) => total_worked.push(response.data.total_worked))
          .catch((error) => console.log(error));

        const searchUserWorkingTime3 =
          "api/stats/user/" +
          user_id +
          "?startDate=" +
          this.dateCharts[2] +
          "&endDate=" +
          this.dateCharts[3];
        await axios
          .get(this.url + searchUserWorkingTime3)
          .then((response) => total_worked.push(response.data.total_worked))
          .catch((error) => console.log(error));

        const searchUserWorkingTime4 =
          "api/stats/user/" +
          user_id +
          "?startDate=" +
          this.dateCharts[3] +
          "&endDate=" +
          this.dateCharts[4];
        await axios
          .get(this.url + searchUserWorkingTime4)
          .then((response) => total_worked.push(response.data.total_worked))
          .catch((error) => console.log(error));

        const searchUserWorkingTime5 =
          "api/stats/user/" +
          user_id +
          "?startDate=" +
          this.dateCharts[4] +
          "&endDate=" +
          this.lastday;
        await axios
          .get(this.url + searchUserWorkingTime5)
          .then((response) => total_worked.push(response.data.total_worked))
          .catch((error) => console.log(error));
      }
      this.chartData.datasets[0].data = total_worked;
    },
  },
  mounted() {
    this.url = this.$store.state.url;
    this.getCurrentWeek();
    this.searchAllWorkingTimeForUser();
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
* {
  font-family: "Poppins", sans-serif;
}

.chartContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3%;
}

@media screen and (max-width: 768px) {
  .chartContainer {
    display: grid;
  }

  .lineContainer,
  .barContainer,
  .pieContainer {
    margin: 0 auto;
  }

  .lineContainer {
    grid-column: 1;
    grid-row: 1;
  }

  .barContainer {
    grid-column: 1;
    grid-row: 2;
  }

  .pieContainer {
    grid-column: 1;
    grid-row: 3;
  }
}
</style>
