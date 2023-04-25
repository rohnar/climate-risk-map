<script setup>
defineProps({
    data: Array
})
</script>

<template>
<table>
  <tr>
    <th v-for="header in Object.keys(data[0])">{{ header }}</th>
  </tr>
  <tr v-for="row in data">
    <td v-for="header in Object.keys(data[0])">{{ row[header] }}</td>
  </tr>
</table>
</template>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
