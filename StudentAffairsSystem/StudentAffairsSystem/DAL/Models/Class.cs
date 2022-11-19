// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    [Table(nameof(Class))]
    public class Class : AuditableEntity
    {
        
        public string Name { get; set; }

        public virtual HashSet<Student> Students { get; set; }
    }


}
