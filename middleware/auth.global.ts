export default defineNuxtRouteMiddleware(async (to) => {
    function checkRouteAccess(route: string) {
      const allowedRoutes = ['/login', '/', '/listOfCats'];
      return allowedRoutes.includes(route);
    }
    
    async function checkUserSession() {
      try {
        const session = await useSupabaseClient().auth.getSession()
        console.log(!session);
        
        if (!session) {
          return navigateTo('/login', {redirectCode: 301});
          // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
        } else {
          return
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    }
    
    const currentRoute = to.path as string;
    
    if (checkRouteAccess(currentRoute)) {
      return    
    } else {
      console.log('rota n permitida');
      return await checkUserSession();
    }

  });
  