<template >
  <tr>
    <td>
      {{ index+1 }}
    </td>
    <td class="text-center">
      {{ student.name }}
    </td>
    <td class="text-center">
      {{ student.mobile }}
    </td>
    <td class="text-center">
      <input
        type="number"
        class="form-control"
        name="roll_no"
        id="roll_no"
        aria-describedby="Roll Number"
        placeholder="Roll No."
        v-model="roll_no"
        min="1"
      />
    </td>
    <td class="text-center">
      {{ student.gender }}
    </td>
    <td class="text-center">
      {{ student.status }}
    </td>
    <td class="text-center">
      {{ student.batch.year }}
    </td>
    <td class="text-center">
      {{ student.term.title }}
    </td>
    <td class="text-center">
      {{ student.faculty.title }}
    </td>
    <td>
      <el-button
        type="primary"
        class="mx-1"
        @click="handleOpenEdit(student.id)"
        icon="el-icon-edit"
        circle
      ></el-button>

      <el-popconfirm
        confirm-button-text="OK"
        cancel-button-text="No, Thanks"
        icon="el-icon-house"
        @confirm="handleUpdate()"
        icon-color="yellow"
        title="Are you sure to update roll no?"
      >
        <el-button
          v-loading="submitting"
          slot="reference"
          type="warning"
          class="mx-1"
          icon="el-icon-house"
          circle
        ></el-button>
      </el-popconfirm>

      <el-popconfirm
        confirm-button-text="OK"
        cancel-button-text="No, Thanks"
        icon="el-icon-info"
        @confirm="handleDelete(student.id)"
        icon-color="red"
        title="Are you sure to delete this?"
      >
        <el-button
          slot="reference"
          type="danger"
          class="mx-1"
          icon="el-icon-delete"
          circle
        ></el-button>
      </el-popconfirm>
    </td>
  </tr>
</template>
<script>
import { doPost } from "../../../helpers/request";
export default {
  props: {
    student: Object,
    index: Number,
    students: Array
  },
  data() {
    return {
      roll_no: this.student.roll_number,
      submitting: false,
    };
  },
  methods: {
    handleOpenEdit(id) {
      this.$router.push({ name: "Student", params: { id: id } });
    },
    handleDelete: async function (id) {
      try {
        const response = await doPost({
          method: "DELETE",
          path: `students/${id}`,
        });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.$notify({
          title: "Success",
          message: data.message || "Action was successful",
          type: "success",
        });
        this.$emit('update:students',this.students.filter((student) => student.id !== id));
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
    handleUpdate: async function () {
      try {
        this.submitting = true;
        const response = await doPost({
          method: "PUT",
          body: {
            roll_no: this.roll_no,
          },
          path: `students/${this.student.id}`,
        });

        const data = await response.json();

        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action Was Successful",
          type: "success",
        });
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
