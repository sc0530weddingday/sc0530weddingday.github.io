new Vue({
    el: '#app',
    data() {
        return {
            isSubmitting: false,
            form: {
                name: '',
                phone: '',
                relation: '',
                attend: '',
                adults: '',
                needCard: '',
                adults: '',
                children: '',
                childSeat: '',
                vegetarian: '',
                address: '',
                message: ''
            }
        }
    },
    watch: {
        // 👇 如果改成「不出席」，自動清空人數資料
        'form.attend'(val) {
            if (val !== '出席') {
                this.form.adults = '';
                this.form.children = '';
                this.form.childSeat = '';
                this.form.vegetarian = '';
            }
        },
        // 👇 新增這個
        'form.needCard'(val) {
            if (val !== '需要') {
                this.form.address = '';
            }
        }
    },
    methods: {
        submitForm() {
            if (this.isSubmitting) return;

            this.isSubmitting = true;

            const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfc7335i3hiO3lR2PS9rTes-5ZoXMA8fPWBsvAL6_3OKDKvqw/formResponse';
            const data = new URLSearchParams();

            data.append('entry.1191758148', this.form.name);
            data.append('entry.1488488050', this.form.phone);
            data.append('entry.331391354', this.form.relation);
            data.append('entry.485616143', this.form.attend);
            data.append('entry.477562905', this.form.adults);
            data.append('entry.1909440281', this.form.children);
            data.append('entry.1669265403', this.form.childSeat);
            data.append('entry.585027738', this.form.vegetarian);
            data.append('entry.2074655098', this.form.needCard);  // 是否需要實體喜帖
            data.append('entry.1843178594', this.form.address);
            data.append('entry.60089512', this.form.message);

            axios.post(url, data)
                .then(this.successHandler)
                .catch(this.successHandler);


        },
        successHandler() {
            swal({
                title: "送出成功 💖",
                text: "我們已收到您的回覆，期待相見！",
                icon: "success",
                buttons: false,   // 不顯示按鈕
                closeOnEsc: false,
                closeOnClickOutside: false
            });

            setTimeout(() => {
                swal.close();
                location.reload();
            }, 2000);

            this.isSubmitting = true;

            // 若你想送出後清空表單
            this.form = {
                name: '',
                phone: '',
                relation: '',
                attend: '',
                adults: '',
                children: '',
                childSeat: '',
                vegetarian: '',
                needCard: '',
                address: '',
                message: ''
            };
        }
    }
});