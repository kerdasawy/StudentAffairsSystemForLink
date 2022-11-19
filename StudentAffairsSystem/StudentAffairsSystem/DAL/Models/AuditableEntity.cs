// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models.Interfaces;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Models
{
    public class AuditableEntity : IAuditableEntity
    {
         
        public Guid Id { get; set; }= Guid.NewGuid();

        [MaxLength(256)]
        public string CreatedBy { get; set; }
        [MaxLength(256)]
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }=false;
        [MaxLength(256)]
        public string DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
    }


}
