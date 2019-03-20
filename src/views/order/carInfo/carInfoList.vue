<template>
    <div>
       <page-header>
           <div slot>选择车辆</div>
       </page-header>
       <div>
       <data-report-filter></data-report-filter>  
       </div>     
    </div>
</template>

<script>
   import pageHeader from '@/components/header/PageHeader'
   import dataReportFilter from '@/components/dataReportFilter'
   
   export default {
       data: function() {
           return {
              cars: [
                  {
                     logo: '',
                     carModel: 'C180K',
                     color: 'hello',
                     trim: 'trim'
                  },
                  {
                     logo: '',
                     carModel: 'C234G',
                     color: 'yes',
                     trim: 'no'
                  }
              ]
           }
       },
       methods: {

       },
       components: {
           pageHeader,
           dataReportFilter
       }
   }
</script>