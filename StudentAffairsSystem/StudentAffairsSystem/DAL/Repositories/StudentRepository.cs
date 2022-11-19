// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;
using DAL.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class StudentRepository : Repository<Student>, IStudentRepository
    {
        public StudentRepository(DbContext context) : base(context)
        { }




        private ApplicationDbContext _appcontext => (ApplicationDbContext)_context;
    }
}
