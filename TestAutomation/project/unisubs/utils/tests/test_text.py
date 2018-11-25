# Amara, universalsubtitles.org
#
# Copyright (C) 2014 Participatory Culture Foundation
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see
# http://www.gnu.org/licenses/agpl-3.0.html.

from django.test import TestCase
from utils import text

class FMTTestCase(TestCase):
    def test_interpolation(self):
        self.assertEquals(text.fmt('%(x)s %(y)s', x=1, y=2), '1 2')

    def test_missing_variable(self):
        self.assertEquals(text.fmt('%(x)s %(y)s', x=1), '1 y')

    def test_extra_variable(self):
        self.assertEquals(text.fmt('%(x)s %(y)s', x=1, y=2, z=3), '1 2')
