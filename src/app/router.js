export default class Router {
    static run(app) {
        const routes = ['', 'index', 'home', 'order-books', 'admin', 'login', 'contact', 'form'];
        const route = location.hash ? location.hash.substr('1') : 'index';
        const routeExists = routes.includes(route);

        if (routeExists) app.goTo(route);
        else {
            location.hash = 'index';
            app.goTo('index');
        }

    
    }
}