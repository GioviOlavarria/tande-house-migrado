function PaymentSuccess() {
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        console.log("PaymentSuccess - Query params:", window.location.search);
        console.log("PaymentSuccess - Token:", token);

        if (token) {
            window.location.href = `/#/exito?token=${token}`;
        } else {
            window.location.href = '/#/';
        }
    }, []);

    return React.createElement(
        'div',
        { className: 'container py-5 text-center' },
        React.createElement('h3', null, 'Procesando pago...'),
        React.createElement('p', { className: 'text-muted' }, 'Redirigiendo...')
    );
}