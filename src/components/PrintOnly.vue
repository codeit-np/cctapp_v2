<template lang="">
      <div class="print-only">
        <div class="d-flex align-items-center border-bottom">
            <img
            src="@/assets/cctlogo.png"
            alt="Cetral Campus Of Technology, Dharan"
            class="w-25"
            />
            <div class="text-center">
                    <h1 class="fs-1">Central Campus Of Technology</h1>
                    <div>Dharan-14, Hattisar</div>
            </div>    
        </div>
    </div>
</template>

<style scoped>


 .print-only{
      display: none;
    }

  @media print {
    .print-only{
      display: block;
    }
  }
</style>