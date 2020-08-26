<template>
  <form>
    <slot></slot>
  </form>
</template>
<script>
export default {
 name: 'SetForm',
 provide() {
   return {
     form: this
   }
 },
 props: {
   model: {
     type: Object
   },
   rules: {
     type: Object
   }
 },
 mounted() {
   this.$nextTick(() => {
     console.log('form name', this.$options.componentName)
   })
 },
 methods: {
   resetFields() {
     this.fields.forEach(field => {
       field.resetField()
     })
   },

   validate(cb) {
     let isValid = true
     let counter = 0
     this.fields.forEach(field => {
       field.validate('', err => {
         if (err) {
           isValid = false
         }
        
         counter++
         if (counter === this.fields.length) {
           if (callback === 'function')
            cb(isValid)
         }
       })
     })
   }
 },
 data() {
   return {
     fields: []
   }
 },
 created() {
   /* 初始化的时候缓存form-item */
   this.$on('on-form-item-add', (filed) => {
     console.log('form-item-add')
     if (filed)
      this.fields.push(filed)
   })

  /* form-item销毁的时候移除 */
   this.$on('on-form-item-destroy', (filed) => {
     console.log('form-item-destroy')
     if (filed.prop) 
      this.fields.splice(this.fields.indexOf(filed), 1)
   })
 }
}
</script>