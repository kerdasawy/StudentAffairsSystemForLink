// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Core;
using DAL.Models;

using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace StudentAffairsSystem.ViewModels
{
    public class ClaimViewModel
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }
}
