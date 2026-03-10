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
                children: '',
                childSeat: '',
                vegetarian: '',
                needCard: '',
                address: '',
                message: ''
            },
            errors: {}
        }
    },
    watch: {
        // 👇 如果改成「不出席」，自動清空人數資料
        'form.attend'(val) {
            if (val !== '可以參加' || form.attend !== '我一定會參加，但是我不確定要攜幾個伴 或是隱+3 ，所以我先填表 (+80分)' || form.attend !== '我原本有事....但為了這個婚禮，決定排除萬難決定參加了！！ (+120分)') {
                this.form.adults = '';
                this.form.children = '';
                this.form.childSeat = '';
                this.form.vegetarian = '';
            }
        },
        // 👇 新增這個
        'form.needCard'(val) {
            if (val !== '我需要紙本喜帖收藏一輩子！') {
                this.form.address = '';
            }
        },

        'form.name'(val) {
            this.errors.name = val ? '' : '• 請輸入姓名'
        },

        'form.phone'(val) {
            if (!val) {
                this.errors.phone = '• 請輸入聯絡電話'
            } else if (!/^09\d{8}$/.test(val)) {
                this.errors.phone = '• 請輸入正確手機格式'
            } else {
                this.errors.phone = ''
            }
        },

        'form.relation'(val) {
            this.errors.relation = val ? '' : '• 請選擇與新人的關係'
        },

        'form.attend'(val) {

            this.errors.attend = val ? '' : '• 請選擇是否出席'

            if (!this.needAttendanceFields) {

                this.form.adults = ''
                this.form.children = ''
                this.form.childSeat = ''
                this.form.vegetarian = ''

                this.errors.adults = ''
                this.errors.children = ''
                this.errors.childSeat = ''
                this.errors.vegetarian = ''
            }
        },
        'form.adults'(val) {
            if (this.needAttendanceFields) {
                this.errors.adults = val ? '' : '• 請選擇出席的成人人數'
            }
        },

        'form.children'(val) {
            if (this.needAttendanceFields) {
                this.errors.children = val ? '' : '• 請選擇出席的兒童人數'
            }
        },

        'form.childSeat'(val) {
            if (this.needAttendanceFields) {
                this.errors.childSeat = val ? '' : '• 請選擇兒童椅'
            }
        },

        'form.vegetarian'(val) {
            if (this.needAttendanceFields) {
                this.errors.vegetarian = val ? '' : '• 請選擇素食'
            }
        },

        'form.needCard'(val) {
            this.errors.needCard = val ? '' : '• 請選擇需要紙本喜帖嗎？'
        },

        'form.address'(val) {
            if (this.form.needCard === '我需要紙本喜帖收藏一輩子！') {
                this.errors.address = val ? '' : '• 請填寫地址'
            }
        },

        'form.message'(val) {
            this.errors.message = val ? '' : '• 無話可說? 填了才能送出！'
        }

    },
    computed: {
        needAttendanceFields() {
            return [
                '可以參加',
                '我一定會參加，但是我不確定要攜幾個伴 或是隱+3 ，所以我先填表 (+80分)',
                '我原本有事....但為了這個婚禮，決定排除萬難決定參加了！！ (+120分)'
            ].includes(this.form.attend)
        }
    },
    methods: {
        clearError(field) {
            this.errors[field] = ''
        },
        validateForm() {
            this.errors = {}

            if (!this.form.name) {
                this.errors.name = '• 請輸入姓名'
            }

            if (!this.form.phone) {
                this.errors.phone = '• 請輸入聯絡電話'
            } else if (!/^09\d{8}$/.test(this.form.phone)) {
                this.errors.phone = '• 請輸入正確手機格式'
            }

            if (!this.form.relation) {
                this.errors.relation = '• 請選擇與新人的關係'
            }

            if (!this.form.attend) {
                this.errors.attend = '• 請選擇是否出席'
            }

            if (this.needAttendanceFields && !this.form.adults) {
                this.errors.adults = '• 請選擇出席的成人人數'
            }

            if (this.needAttendanceFields && !this.form.children) {
                this.errors.children = '• 請選擇出席的兒童人數'
            }

            if (this.needAttendanceFields && !this.form.childSeat) {
                this.errors.childSeat = '• 請選擇兒童椅'
            }

            if (this.needAttendanceFields && !this.form.vegetarian) {
                this.errors.vegetarian = '• 請選擇素食'
            }
            if (!this.form.needCard) {
                this.errors.needCard = '• 請選擇需要紙本喜帖嗎？'
            }

            if (this.form.needCard === '我需要紙本喜帖收藏一輩子！' && !this.form.address) {
                this.errors.address = '• 請填寫地址'
            }

            if (!this.form.message) {
                this.errors.message = '• 無話可說? 填了才能送出！'
            }

            return Object.keys(this.errors).length === 0
        },
        submitForm() {
            if (!this.validateForm()) {
                this.$nextTick(() => {
                    const el = document.querySelector('.is-invalid')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                })
                return
            }
            // if (this.isSubmitting) return;

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
                title: "送出成功 ♡",
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
            this.errors = {
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
