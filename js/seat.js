new Vue({
    el: '#seat',
    data() {
        return {
            apiUrl: 'https://script.google.com/macros/s/AKfycbwcefeLPZOr9w4q06rUWJw1u6pKuJcH6pY0_oKpfERfRBa_9q3-NPgmHrte1l4qeZ8J/exec',
            loading: false,
            showModal: false,
            modalState: 'loading',
            modalMessage: '',
            isComposing: false, // 是否正在中文選字 / 組字
            form: {
                name: ''
            },
            result: {
                table: '',
                seat: '',
                name: '',
                note: ''
            }
        };
    },
    methods: {
        resetResult() {
            this.result = {
                table: '',
                seat: '',
                name: '',
                note: ''
            };
        },

        openLoadingModal() {
            this.showModal = true;
            this.modalState = 'loading';
            this.modalMessage = '正在查詢座位資訊，請稍候...';
            this.resetResult();
        },

        showSuccessModal(data) {
            this.showModal = true;
            this.modalState = 'success';
            this.modalMessage = '';
            this.result = {
                table: data.table || '',
                seat: data.seat || '',
                name: data.name || '',
                note: data.note || ''
            };
        },

        showErrorModal(message) {
            this.showModal = true;
            this.modalState = 'error';
            this.modalMessage = message || '查無此姓名，請重新輸入';
            this.resetResult();
        },

        handleCompositionStart() {
            this.isComposing = true;
        },

        handleCompositionEnd(event) {
            this.isComposing = false;

            // 有些瀏覽器 compositionend 後 input value 還沒同步完成
            // 用 nextTick 讓 v-model 更新完
            this.$nextTick(() => {
                this.form.name = (this.form.name || '').trim();
            });
        },

        handleEnter(event) {
            // 中文輸入法選字中，不送出
            if (this.isComposing || event.isComposing || event.keyCode === 229) {
                return;
            }

            this.searchSeat();
        },

        jsonpRequest(name) {
            return new Promise((resolve, reject) => {
                const callbackName = 'seatCallback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
                const script = document.createElement('script');

                const timeout = setTimeout(() => {
                    cleanup();
                    reject(new Error('JSONP timeout'));
                }, 10000);

                const cleanup = () => {
                    clearTimeout(timeout);
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    try {
                        delete window[callbackName];
                    } catch (e) {
                        window[callbackName] = undefined;
                    }
                };

                window[callbackName] = (data) => {
                    cleanup();
                    resolve(data);
                };

                script.onerror = () => {
                    cleanup();
                    reject(new Error('JSONP script load error'));
                };

                script.src =
                    this.apiUrl +
                    '?name=' + encodeURIComponent(name) +
                    '&callback=' + encodeURIComponent(callbackName);

                document.body.appendChild(script);
            });
        },

        async searchSeat() {
            if (this.loading) return;

            const name = (this.form.name || '').trim();

            if (!name) {
                this.showErrorModal('請輸入姓名');
                return;
            }

            this.loading = true;
            this.openLoadingModal();

            try {
                const result = await this.jsonpRequest(name);

                if (result && result.success) {
                    this.showSuccessModal(result.data || {});
                } else {
                    this.showErrorModal((result && result.message) || '查無此姓名，請重新輸入');
                }
            } catch (error) {
                console.error('查詢失敗:', error);
                this.showErrorModal('系統忙碌中，請稍後再試');
            } finally {
                this.loading = false;
            }
        },

        initMagnifier() {
            const wrap      = document.getElementById('seat-magnifier-wrap');
            const overlay   = document.getElementById('seat-zoom-overlay');
            const closeBtn  = document.getElementById('seat-zoom-close');
            const scrollEl  = document.getElementById('seat-zoom-scroll');
            if (!wrap || !overlay || !scrollEl) return;

            const isTouch = ('ontouchstart' in window);

            // 拖移變數（桌機用）
            let dragging = false, startX, startY, sLeft, sTop;
            const onDown = (e) => {
                if (e.target === closeBtn) return;
                dragging = true;
                startX = e.clientX; startY = e.clientY;
                sLeft = overlay.scrollLeft; sTop = overlay.scrollTop;
                overlay.style.cursor = 'grabbing';
                e.preventDefault();
            };
            const onMove = (e) => {
                if (!dragging) return;
                overlay.scrollLeft = sLeft - (e.clientX - startX);
                overlay.scrollTop  = sTop  - (e.clientY - startY);
            };
            const onUp = () => { dragging = false; overlay.style.cursor = 'grab'; };

            const close = () => {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                overlay.style.cursor = '';
                overlay.removeEventListener('mousedown', onDown);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
            };

            const open = () => {
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                overlay.scrollLeft = 0;
                overlay.scrollTop  = 0;
                if (!isTouch) {
                    scrollEl.style.width = '130vw'; // 桌機較小
                    overlay.style.cursor = 'grab';
                    overlay.addEventListener('mousedown', onDown);
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup',   onUp);
                } else {
                    scrollEl.style.width = '280vw'; // 手機較大
                }
            };

            if (wrap._tapOpen) wrap.removeEventListener('click', wrap._tapOpen);
            wrap._tapOpen = open;
            wrap.addEventListener('click', open);
            closeBtn.onclick = close;
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        },

        closeModal() {
            this.showModal = false;
        },

        handleEsc(event) {
            if (event.key === 'Escape' && this.showModal) {
                this.closeModal();
            }
        }
    },
    watch: {
        modalState(val) {
            if (val === 'success') {
                this.$nextTick(() => { this.initMagnifier(); });
            }
        }
    },
    mounted() {
        document.addEventListener('keydown', this.handleEsc);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleEsc);
    }
});