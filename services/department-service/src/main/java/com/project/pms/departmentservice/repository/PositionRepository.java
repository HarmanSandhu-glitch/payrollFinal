package com.project.pms.departmentservice.repository;

import com.project.pms.departmentservice.entity.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
}