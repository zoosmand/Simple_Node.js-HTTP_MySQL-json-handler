CREATE DEFINER=`crm`@`localhost` PROCEDURE `crm2`.`SELECT_customer_type`(
		IN `customerTypeUid` 				INT UNSIGNED
	)
    READS SQL DATA
BEGIN
	SELECT
		  JSON_OBJECT('value', ct.uid)									    AS customerTypeUid
		, JSON_OBJECT('value', ct.`type`)								    AS customerTypeName
		, JSON_OBJECT('value', IFNULL(ct.description, ''))	AS customerTypeDescription
		, '{}'															                AS scrollAttributes
	FROM crm2.customer_types ct 
	WHERE
		CASE WHEN customerTypeUid = 0 THEN 1 ELSE (ct.uid = customerTypeUid) END
	ORDER BY ct.uid 
	;
END
