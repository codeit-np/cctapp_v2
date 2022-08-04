<template lang="">
    <div class="card">
        <div class="card-header px-2">
            <div class="d-flex justify-content-between align-items-center">
                <strong>
                    {{ this.title }}
                </strong>
                <div class="d-flex">
                    <el-button
                        @click="exportToCsv"
                        class="mx-2"
                        type="text"
                        >
                        <i class="fa fa-download" aria-hidden="true"></i> Download CSV
                    </el-button>
                     <el-button
                      class="mx-2"
                        v-print="'#printable'"
                        type="text"
                        >
                        <i class="fa fa-print" aria-hidden="true"></i> Print
                    </el-button>

                     <el-input
                      class="mx-2"
                      placeholder="Filter"
                      label="Filter"
                      v-model="filter" />

                     <slot name="additional"></slot>
                </div>
            </div>
        </div>
        <div class="card-body table-responsive" id="printable">
            <print-only />
            <table class="table table-sm table-striped" >
                <thead>
                    <tr>
                        <th>
                            S.N.
                        </th>
                        <th v-for="(header,index) in headers" :key="index">
                            {{ header.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,index) in filteredData" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td v-for="(header, index) in headers" :key="index">
                            {{ row[header.field]||'-' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import PrintOnly from "./PrintOnly.vue";
export default {
  props: {
    title: String,
    rows: Array,
    headers: Array,
  },
  components: {
    PrintOnly,
  },
  data() {
    return {
      filter: "",
    };
  },
  methods: {
    convertToCSV(headers = [], data) {
      let csv = headers.map((headers) => headers.label).join(",") + "\n";

      data.forEach((row) => {
        csv +=
          headers
            .map((header) => row[header.field].replaceAll(",", "-"))
            .join(",") + "\n";
      });
      return csv;
    },
    exportToCsv() {
      let csv = this.convertToCSV(this.headers, this.filteredData);
      let blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${this.title}-${Date()}.csv`);
      link.click();
    },
  },
  computed: {
    filteredData() {
      return this.rows.filter((row)=>{
        if(!this.filter) return true;
        // Filter Key is turned to lower case
        const lowerFilter = new String(this.filter).toLowerCase();
        // Row Value is converted to lower case for case insensitive search
        return Object.values(row).some(value=>value.toLowerCase().includes(lowerFilter))
      });
    },
  },
};
</script>
