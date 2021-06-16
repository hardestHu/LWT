<template>
    <div>
        <Editor :id="tinymceId" :init="init" :disabled="disabled" v-model="myValue"  ></Editor>
    </div>
</template>

<script>
    //引入tinymce-vue
    import Editor from '@tinymce/tinymce-vue'
    export default {
        components: {Editor},
        props: {
            //编号
            id:{
                type:String
            },
            //内容
            value: {
                type: String,
                default: ''
            },
            //是否禁用
            disabled: {
                type: Boolean,
                default: false
            },
            //插件
            plugins: {
                type: [String, Array],
                default: 'autolink link hr image preview imagetools'
            },
             //工具栏
            toolbar: {
                type: [String, Array],
                default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table '
            }
        },
        data() {
            let that = this;
            return {
                tinymceId: this.id || 'vue-tinymce'+ Date.parse(new Date()),
                myValue :this.value,
                init:{
                    //汉化,路径是自定义的，一般放在public或static里面，汉化文件要自己去下载
                    // language_url: '/tinymce/zh_CN.js',
                    language: 'zh_CN',
                    //皮肤
                    skin: 'oxide',
                    //插件
                    plugins: this.plugins,
                    //工具栏
                    toolbar: this.toolbar,
                    //高度
                    height: 500,
                    //隐藏下方版本toolbar
                    statusbar: false,
                    // images_upload_url: '/medical/help/uploadPictures',
                    // images_upload_base_path: '',
                    //图片上传
                    images_upload_handler: function (blobInfo, success, failure) {
                        // 文件上传的formData传递
                        let formData = new FormData();
                        formData.append('files', blobInfo.blob(), blobInfo.filename());
                        //上传的api,和后端配合，返回的是图片的地址，然后加上公共的图片前缀
                        that.$http.upload(formData).then(res=>{
                            let src = `https://laowaitong.gzspiral.com/laowaitong/help/downloadFile?medicalPicId=${res.picIds[0]}`
                            success(src)
                        }).catch(res => {
                            failure('图片上传失败:' + res)
                        });
                    }
                }
            }
        },
        methods:{

        },
        watch: {
            //监听内容变化
            value(newValue) {
                this.myValue = newValue
            },
            myValue(newValue) {
                this.$emit('input', newValue)
            }
        }
    }
</script>
<style lang='scss'>
    //没有申请key的话会出现一个弹窗要去申请key,在这里把那个弹窗隐藏，当然也可以自己申请key再使用
    .tox-notifications-container{
        display: none;
    }
    //在页面正常使用时不用加这个样式，在弹窗使用时，要加这个样式，因为使用弹窗，z-index层数比较低，工具栏的一些工具不能使用，要将z-index层数提高。
    .tox-tinymce-aux{
        z-index: 5000 !important;
    }
</style>