<script>
export default {
    name: 'ZtStatus',
    data() {
        return {};
    },
    props: {
        status: Array,
        value: String,
        percent: {
            type: Number,
            default: 80
        }
    },
    render(h) {
        if (Array.isArray(this.status) && this.value) {
            let item = this.status.find(arr => {
                return arr.value.toLowerCase() === this.value;
            });
            if (item !== undefined) {
                if (item.type === 'progress') {
                    return (
                        <span class={['inline-block', 'zt-status-progress',item.className, 'text-center']}>
                            {item.text}
                            <zt-icon class={[item.className]} icon={item.icon} percent={this.percent} type={item.type ? item.type : 'svg'}/>
                        </span>
                    );
                } else {
                    return (
                        <span class={[item.className]}>
                            <zt-icon class={[item.className]} icon={item.icon} type={item.type ? item.type : 'svg'} class="mr5" />
                            {item.text}
                        </span>
                    );
                }
            }
        }
        return '';
    }
};
</script>
