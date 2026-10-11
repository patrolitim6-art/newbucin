class StatCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Title';
        const icon = this.getAttribute('icon') || 'fa-chart-line';
        const value = this.getAttribute('value') || '0';
        const trend = this.getAttribute('trend') || '';
        const color = this.getAttribute('color') || '#06b6d4';
        const path = this.getAttribute('path') || 'M 0,15 L 100,15';

        this.innerHTML = `
            <div class="stat-card">
                <div>
                    <h3><i class="fa-solid ${icon}"></i> ${title}</h3>
                    <div class="value">${value}</div>
                    <div class="trend">${trend}</div>
                </div>
                <svg class="sparkline" viewBox="0 0 100 30">
                    <path d="${path}" stroke="${color}"/>
                </svg>
            </div>
        `;
    }
}

customElements.define('stat-card', StatCard);