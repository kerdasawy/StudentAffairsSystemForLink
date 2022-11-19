// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;
using DAL.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class ClassRepository : Repository<Class>, IClassRepository
    {
        public ClassRepository(DbContext context) : base(context)
        { }




        private ApplicationDbContext _appcontext => (ApplicationDbContext)_context;
    }
}
