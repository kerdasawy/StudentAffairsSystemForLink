// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Repositories;
using DAL.Repositories.Interfaces;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;

        IStudentRepository _stuents;
        IClassRepository _classes;



        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }



        public IStudentRepository Stuents
        {
            get
            {
                if (_stuents == null)
                    _stuents = new StudentRepository(_context);

                return _stuents;
            }
        }
        public IClassRepository Classes
        {
            get
            {
                if (_classes == null)
                    _classes = new ClassRepository(_context);

                return _classes;
            }
        }







        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
