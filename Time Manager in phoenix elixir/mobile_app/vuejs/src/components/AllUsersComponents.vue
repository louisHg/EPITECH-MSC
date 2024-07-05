<template>
  <h1>AllUsers</h1>
  <table>
    <thead>
      <tr>
        <th  class="headerTab" colspan="1">Role : ALL</th>
        <th  class="headerTab" colspan="1"></th>
        <th  class="headerTab" colspan="1"></th>
        <th  class="headerTab" colspan="1">Search</th>
      </tr>
      <tr class="subHeaderTab">
        <th class="subHeaderTab" colspan="1">Name</th>
        <th class="subHeaderTab" colspan="1">Weekly-Schedule</th>
        <th class="subHeaderTab" colspan="1">Role</th>
        <th class="subHeaderTab" colspan="1">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Theo</td>
        <td>35h</td>
        <td>Employee</td>
        <td class="actions">
          <button class="save">EDIT</button>
          <button class="save">DELETE</button>
        </td>
      </tr>
      <tr>
        <td>Theo</td>
        <td>35h</td>
        <td>Employee</td>
        <td class="actions">
          <button class="save">EDIT</button>
          <button class="save">DELETE</button>
        </td>
      </tr>
      <tr>
        <td>Theo</td>
        <td>35h</td>
        <td>Employee</td>
        <td class="actions">
          <button class="save">EDIT</button>
          <button class="save">DELETE</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script></script>

<style>
table {
    margin: 0 auto;
    margin-top: 20px;
    width: 80%;
}

/*HEADER TAB*/
tr .headerTab {
  font-weight: 800;
  font-size: 20px;
}

tr .subHeaderTab {
  font-size: 18px;
  color: black;
}

/*ACTIONS BUTTONS*/
table tbody .actions {
  display: flex;
}

table tbody .actions .save {
  border-radius: 25px;
  width: 30%;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
}

</style>
